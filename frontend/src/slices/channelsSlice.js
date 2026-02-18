// frontend/src/slices/channelsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

// Async thunks для работы с каналами
export const addChannel = createAsyncThunk(
  "channels/addChannel",
  async (name, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/channels", { name });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const renameChannel = createAsyncThunk(
  "channels/renameChannel",
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/channels/${id}`, { name });
      return response.data;
    } catch (error) {
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
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

export const fetchChannels = createAsyncThunk(
  "channels/fetchChannels",
  async () => {
    const response = await axiosInstance.get("/channels");
    return response.data;
  },
);

export const fetchMessages = createAsyncThunk(
  "channels/fetchMessages",
  async () => {
    const response = await axiosInstance.get("/messages");
    return response.data;
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
      type: null, // 'adding', 'renaming', 'removing'
      channelId: null,
    },
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    // Управление модальными окнами
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
    // Для сокет-событий (оптимистичные обновления)
    socketAddChannel: (state, action) => {
      const channel = action.payload;
      const exists = state.channels.some((ch) => ch.id === channel.id);
      if (!exists) {
        state.channels.push(channel);
      }
    },
    socketRenameChannel: (state, action) => {
      const { id, name } = action.payload;
      const channel = state.channels.find((ch) => ch.id === id);
      if (channel) {
        channel.name = name;
      }
    },
    socketRemoveChannel: (state, action) => {
      const channelId = action.payload.id || action.payload;

      // Удаляем канал
      state.channels = state.channels.filter((ch) => ch.id !== channelId);

      // Удаляем сообщения канала
      state.messages = state.messages.filter(
        (msg) => Number(msg.channelId) !== Number(channelId),
      );

      // Если удаляем текущий канал, переключаемся на general
      if (Number(state.currentChannelId) === Number(channelId)) {
        const generalChannel = state.channels.find(
          (ch) => ch.name === "general",
        );
        state.currentChannelId = generalChannel?.id || null;
      }
    },
    // Обычные редьюсеры (без сетевых запросов)
    addMessage: (state, action) => {
      const message = action.payload;
      if (message.text && !message.body) {
        message.body = message.text;
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
      // Загрузка каналов
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
        state.error = action.error.message;
      })

      // Загрузка сообщений
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.messages = action.payload.map((msg) => ({
          ...msg,
          body: msg.body || msg.text,
        }));
      })

      // Добавление канала
      .addCase(addChannel.pending, (state) => {
        state.error = null;
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        // Канал уже добавится через сокет, но на всякий случай
        const newChannel = action.payload;
        const exists = state.channels.some((ch) => ch.id === newChannel.id);
        if (!exists) {
          state.channels.push(newChannel);
        }
        // Переключаемся на новый канал
        state.currentChannelId = newChannel.id;
        // Закрываем модалку
        state.modals.isOpen = false;
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.error = action.payload || "Ошибка при создании канала";
      })

      // Переименование канала
      .addCase(renameChannel.pending, (state) => {
        state.error = null;
      })
      .addCase(renameChannel.fulfilled, (state, action) => {
        // Обновление уже придет через сокет
        // Закрываем модалку
        state.modals.isOpen = false;
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.error = action.payload || "Ошибка при переименовании канала";
      })

      // Удаление канала
      .addCase(removeChannel.pending, (state) => {
        state.error = null;
      })
      .addCase(removeChannel.fulfilled, (state, action) => {
        // Удаление уже придет через сокет
        // Закрываем модалку
        state.modals.isOpen = false;
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
