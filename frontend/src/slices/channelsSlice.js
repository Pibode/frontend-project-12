// frontend/src/slices/channelsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import i18n from "../lib/i18n";
import { cleanProfanity } from "../utils/profanity"; // <-- Импортируем фильтр
import axios from "axios";

// Настройка axios для отправки токена
const axiosInstance = axios.create({
  baseURL: "/api/v1",
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка сетевых ошибок
const handleNetworkError = (error) => {
  if (!navigator.onLine) {
    toast.error(i18n.t("toasts.errors.offline"));
  } else if (error.code === "ECONNABORTED") {
    toast.error(i18n.t("chat.errors.messageTimeout"));
  } else if (error.response?.status === 401) {
    toast.error(i18n.t("chat.errors.sessionExpired"));
  } else if (error.response?.status >= 500) {
    toast.error(i18n.t("chat.errors.serverError"));
  } else {
    toast.error(i18n.t("toasts.errors.network"));
  }
};

// Функция для получения текущего пользователя
const getCurrentUsername = () => {
  return localStorage.getItem("username");
};

// Функция для фильтрации сообщения
const filterMessage = (message) => {
  if (!message) return message;

  const filteredMessage = { ...message };

  // Фильтруем текст сообщения
  if (filteredMessage.text) {
    filteredMessage.text = cleanProfanity(filteredMessage.text);
  }
  if (filteredMessage.body) {
    filteredMessage.body = cleanProfanity(filteredMessage.body);
  }

  return filteredMessage;
};

// Async thunks для работы с каналами
export const addChannel = createAsyncThunk(
  "channels/addChannel",
  async (name, { rejectWithValue }) => {
    try {
      // Фильтруем название канала перед отправкой
      const filteredName = cleanProfanity(name);
      const response = await axiosInstance.post("/channels", {
        name: filteredName,
      });
      return response.data;
    } catch (error) {
      handleNetworkError(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const renameChannel = createAsyncThunk(
  "channels/renameChannel",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      // Фильтруем название канала перед отправкой
      const filteredName = cleanProfanity(name);
      const response = await axiosInstance.patch(`/channels/${id}`, {
        name: filteredName,
      });
      return response.data;
    } catch (error) {
      handleNetworkError(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const removeChannel = createAsyncThunk(
  "channels/removeChannel",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/channels/${id}`);
      return id;
    } catch (error) {
      handleNetworkError(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchChannels = createAsyncThunk(
  "channels/fetchChannels",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/channels");
      return response.data;
    } catch (error) {
      handleNetworkError(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchMessages = createAsyncThunk(
  "channels/fetchMessages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/messages");
      // Фильтруем все сообщения при загрузке
      const filteredMessages = response.data.map(filterMessage);
      return filteredMessages;
    } catch (error) {
      handleNetworkError(error);
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

const channelsSlice = createSlice({
  name: "channels",
  initialState: {
    channels: [],
    messages: [],
    currentChannelId: null,
    loading: false,
    error: null,
    modals: {
      isOpen: false,
      type: null,
      channelId: null,
    },
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    openModal: (state, action) => {
      state.modals = {
        isOpen: true,
        type: action.payload.type,
        channelId: action.payload.channelId || null,
      };
    },
    closeModal: (state) => {
      state.modals = {
        isOpen: false,
        type: null,
        channelId: null,
      };
    },
    socketAddChannel: (state, action) => {
      const channel = action.payload;
      const exists = state.channels.some((ch) => ch.id === channel.id);
      if (!exists) {
        state.channels.push(channel);

        // Проверяем, не является ли это нашим собственным действием
        const currentUser = getCurrentUsername();

        setTimeout(() => {
          if (!document.querySelector(".Toastify__toast--success")) {
            toast.info(i18n.t("toasts.channel.created"));
          }
        }, 100);
      }
    },
    socketRenameChannel: (state, action) => {
      const { id, name } = action.payload;
      const channel = state.channels.find((ch) => ch.id === id);
      if (channel) {
        channel.name = name;

        // Аналогичная проверка
        setTimeout(() => {
          if (!document.querySelector(".Toastify__toast--success")) {
            toast.info(i18n.t("toasts.channel.renamed"));
          }
        }, 100);
      }
    },
    socketRemoveChannel: (state, action) => {
      const channelId = action.payload.id || action.payload;
      const channelName = state.channels.find(
        (ch) => ch.id === channelId,
      )?.name;

      state.channels = state.channels.filter((ch) => ch.id !== channelId);
      state.messages = state.messages.filter(
        (msg) => Number(msg.channelId) !== Number(channelId),
      );

      if (Number(state.currentChannelId) === Number(channelId)) {
        const generalChannel = state.channels.find(
          (ch) => ch.name === "general",
        );
        state.currentChannelId = generalChannel?.id || null;
      }

      if (channelName) {
        setTimeout(() => {
          if (!document.querySelector(".Toastify__toast--success")) {
            toast.info(i18n.t("toasts.channel.removed"));
          }
        }, 100);
      }
    },
    addMessage: (state, action) => {
      // Фильтруем сообщение перед добавлением
      let message = action.payload;

      // Нормализуем и фильтруем
      if (message.text && !message.body) {
        message.body = message.text;
      }

      // Фильтруем содержимое
      if (message.body) {
        message = { ...message, body: cleanProfanity(message.body) };
      }
      if (message.text) {
        message = { ...message, text: cleanProfanity(message.text) };
      }

      const exists = state.messages.some((msg) => msg.id === message.id);
      if (!exists) {
        state.messages.push(message);
        state.messages.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(a.createdAt) - new Date(b.createdAt);
          }
          return (a.id || 0) - (b.id || 0);
        });
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
        const generalChannel = action.payload.find(
          (ch) => ch.name === "general",
        );
        state.currentChannelId = generalChannel?.id || null;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(fetchMessages.fulfilled, (state, action) => {
        // Сообщения уже отфильтрованы в thunk
        state.messages = action.payload.map((msg) => ({
          ...msg,
          body: msg.body || msg.text,
        }));
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(addChannel.pending, (state) => {
        state.error = null;
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        const newChannel = action.payload;
        const exists = state.channels.some((ch) => ch.id === newChannel.id);
        if (!exists) {
          state.channels.push(newChannel);
        }
        state.currentChannelId = newChannel.id;
        state.modals.isOpen = false;

        toast.success(i18n.t("toasts.channel.created"));
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.error = action.payload || "Ошибка при создании канала";
      })

      .addCase(renameChannel.pending, (state) => {
        state.error = null;
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        state.modals.isOpen = false;

        toast.success(i18n.t("toasts.channel.renamed"));
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.error = action.payload || "Ошибка при переименовании канала";
      })

      .addCase(removeChannel.pending, (state) => {
        state.error = null;
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        state.modals.isOpen = false;

        toast.success(i18n.t("toasts.channel.removed"));
      })
      .addCase(removeChannel.rejected, (state, action) => {
        state.error = action.payload || "Ошибка при удалении канала";
      });
  },
});

export const {
  setCurrentChannel,
  openModal,
  closeModal,
  socketAddChannel,
  socketRenameChannel,
  socketRemoveChannel,
  addMessage,
} = channelsSlice.actions;

export default channelsSlice.reducer;
