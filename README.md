### Hexlet tests and linter status:
[![Actions Status](https://github.com/Pibode/frontend-project-12/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/Pibode/frontend-project-12/actions)

# Аналог Slack-чата

Упрощенная версия Slack-чата.

## Демо
https://frontend-project-12-u635.onrender.com

## Технологии
- React
- Vite
- @hexlet/chat-server
- Redux Toolkit
- Socket.IO
- i18next
- React Toastify
- Leo Profanity
- Rollbar (мониторинг ошибок)

## Мониторинг ошибок
Проект использует Rollbar для отслеживания ошибок в продакшене. 
Все необработанные ошибки, исключения React и сетевые ошибки логируются в Rollbar.

## Переменные окружения
Для работы Rollbar в продакшене необходимо установить переменную:
- `VITE_ROLLBAR_ACCESS_TOKEN` - токен доступа к Rollbar

## Запуск проекта локально
```bash
make install
make build
make start