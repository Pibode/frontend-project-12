// frontend/src/lib/rollbar.js
import Rollbar from "rollbar";
import { env } from "../config";

// Конфигурация Rollbar
const rollbarConfig = {
  accessToken:
    import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN ||
    "77a2e14f3c294897b59e1d1cc58325db", // Замените на свой токен
  environment: import.meta.env.MODE || "development",
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: import.meta.env.PROD,
  payload: {
    client: {
      javascript: {
        code_version: "1.0.0",
        source_map_enabled: true,
      },
    },
  },
};

// Создаем экземпляр Rollbar
const rollbar = new Rollbar(rollbarConfig);

// Функция для логирования ошибок с дополнительным контекстом
export const logError = (error, context = {}) => {
  if (import.meta.env.PROD) {
    rollbar.error(error, context);
  } else {
    console.error("Development error:", error, context);
  }
};

// Функция для логирования предупреждений
export const logWarning = (message, context = {}) => {
  if (import.meta.env.PROD) {
    rollbar.warning(message, context);
  } else {
    console.warn("Development warning:", message, context);
  }
};

// Функция для логирования информации
export const logInfo = (message, context = {}) => {
  if (import.meta.env.PROD) {
    rollbar.info(message, context);
  } else {
    console.info("Development info:", message, context);
  }
};

// Функция для установки пользователя
export const setRollbarUser = (user) => {
  if (user && import.meta.env.PROD) {
    rollbar.configure({
      payload: {
        person: {
          id: user.username,
          username: user.username,
        },
      },
    });
  }
};

// Функция для очистки пользователя при выходе
export const clearRollbarUser = () => {
  if (import.meta.env.PROD) {
    rollbar.configure({
      payload: {
        person: null,
      },
    });
  }
};

export default rollbar;
