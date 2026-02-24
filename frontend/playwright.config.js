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

    webServer: {
        command: 'cd frontend && npm run dev -- --host 0.0.0.0',
        url: 'http://localhost:5001',
        reuseExistingServer: !process.env.CI, // локально можно и не перезапускать, если dev server есть

        timeout: 60_000, // подстраховаемся, если Vite с запозданием отвечает
    },

    // time outs
    timeout: 30_000,

    // удобный репортер для локального запуска
    reporter: 'list',
})
