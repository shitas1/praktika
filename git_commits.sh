#!/usr/bin/env bash
# Создаёт историю коммитов. Запускать один раз из корня проекта.
set -e
git init -b main
git add .gitignore && git commit -m "chore: add .gitignore"
git add database && git commit -m "feat(db): add tasks table schema"
git add backend/package.json backend/.env.example backend/src/config && git commit -m "feat(backend): init Express project and DB connection"
git add backend/src/middleware backend/src/app.js backend/src/server.js && git commit -m "feat(backend): add app setup and error handling"
git add backend/src/controllers backend/src/routes && git commit -m "feat(backend): implement tasks CRUD API"
git add backend/scripts && git commit -m "feat(backend): add db:init script"
git add frontend/package.json frontend/vite.config.js frontend/index.html frontend/src/main.jsx frontend/src/api.js && git commit -m "feat(frontend): init React app and API client"
git add frontend/src/components/TaskForm.jsx frontend/src/App.jsx && git commit -m "feat(frontend): add task creation form and app state"
git add frontend/src/components/TaskTable.jsx frontend/src/styles.css && git commit -m "feat(frontend): add task table with status select and delete"
git add python && git commit -m "feat(python): add export_tasks.py for CSV export"
git add README.md && git commit -m "docs: add README with setup instructions"
