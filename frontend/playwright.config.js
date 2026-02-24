// @ts-check
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests', // т.к. tests в корне, а Vite сервер запускается во frontend

  use: {
    baseURL: 'http://localhost:5001', // стандартный порт Vite
    headless: true, // headless как на CI

    locale: 'ru-RU', // <- добавленная строка

    viewport: { width: 1366, height: 768 },
  },

  // time outs
  timeout: 30_000,

  // удобный репортер для локального запуска
  reporter: 'list',
})
