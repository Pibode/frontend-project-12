// frontend/src/config.js

// Конфигурация окружения
export const env = {
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  mode: import.meta.env.MODE,
  rollbarToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  appVersion: "1.0.0",
};

// Проверка наличия необходимых переменных в продакшене
if (env.isProduction && !env.rollbarToken) {
  console.warn("VITE_ROLLBAR_ACCESS_TOKEN не настроен в продакшене");
}
