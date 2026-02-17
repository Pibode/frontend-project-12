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
  },
  reducers: {
    setCurrentChannel: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addMessage: (state, action) => {
      // Нормализуем сообщение для единообразия
      const message = action.payload;

      // Убеждаемся что у сообщения есть body (некоторые API используют text)
      if (message.text && !message.body) {
        message.body = message.text;
      }

      // Добавляем сообщение в список
      state.messages.push(message);

      // Сортируем сообщения по id или времени, если нужно
      state.messages.sort((a, b) => {
        // Если есть поле createdAt, используем его
        if (a.createdAt && b.createdAt) {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
        // Иначе сортируем по id (предполагая, что они возрастают)
        return (a.id || 0) - (b.id || 0);
      });
    },
    addChannel: (state, action) => {
      state.channels.push(action.payload);
    },
    renameChannel: (state, action) => {
      const { id, name } = action.payload;
      const channel = state.channels.find((ch) => ch.id === id);
      if (channel) {
        channel.name = name;
      }
    },
    removeChannel: (state, action) => {
      const channelId = action.payload;

      // Удаляем канал
      state.channels = state.channels.filter((ch) => ch.id !== channelId);

      // Удаляем все сообщения этого канала
      state.messages = state.messages.filter(
        (msg) => Number(msg.channelId) !== Number(channelId),
      );

      // Если удаляем текущий канал, переключаемся на общий
      if (Number(state.currentChannelId) === Number(channelId)) {
        const generalChannel = state.channels.find(
          (ch) => ch.name === "general",
        );
        state.currentChannelId = generalChannel?.id || null;
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

        // Устанавливаем текущий канал на general
        const generalChannel = action.payload.find(
          (ch) => ch.name === "general",
        );
        state.currentChannelId = generalChannel?.id || null;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        // Нормализуем все сообщения при загрузке
        const messages = action.payload.map((msg) => ({
          ...msg,
          body: msg.body || msg.text, // гарантируем наличие body
        }));
        state.messages = messages;
      });
  },
});

export const {
  setCurrentChannel,
  addMessage,
  addChannel,
  renameChannel,
  removeChannel,
} = channelsSlice.actions;

export default channelsSlice.reducer;
