# Task Manager

Простое веб-приложение для управления задачами. Можно создать задачу, посмотреть список, поменять статус и удалить.

Что использовал: React, Node.js (Express), PostgreSQL, Python.

## Что где лежит

- `database/schema.sql` — SQL-скрипт, который создаёт таблицу `tasks`
- `backend/` — сервер на Express (API)
- `frontend/` — сайт на React
- `python/export_tasks.py` — скрипт, который выгружает задачи в CSV

## Что делает каждый файл

### База данных

- `database/schema.sql` — создаёт таблицу `tasks` с полями id, title, description, status, created_at. Статус может быть только new, in_progress или done.

### Backend

- `package.json` — список библиотек и команды запуска
- `.env.example` — пример настроек (порт и адрес базы данных)
- `src/server.js` — запускает сервер
- `src/app.js` — настраивает приложение и подключает маршруты
- `src/config/db.js` — подключение к PostgreSQL
- `src/routes/tasks.js` — адреса API (GET, POST, PUT, DELETE)
- `src/controllers/tasksController.js` — код для каждого запроса: проверка данных и работа с базой
- `src/middleware/errorHandler.js` — обработка ошибок, чтобы сервер отвечал понятным сообщением
- `scripts/initDb.js` — создаёт таблицу в базе по файлу schema.sql

### Frontend

- `package.json` — библиотеки и команды запуска
- `vite.config.js` — настройки Vite, запросы на `/api` отправляются на сервер (порт 3000)
- `index.html` — главная страница
- `src/main.jsx` — точка входа React
- `src/App.jsx` — главный компонент, тут вся логика работы с задачами
- `src/api.js` — функции для запросов к серверу
- `src/components/TaskForm.jsx` — форма создания задачи
- `src/components/TaskTable.jsx` — таблица задач, выбор статуса и кнопка удаления
- `src/styles.css` — стили

### Python

- `export_tasks.py` — берёт все задачи из PostgreSQL и сохраняет в файл tasks.csv
- `requirements.txt` — нужные библиотеки
- `.env.example` — пример настроек для подключения к базе

### Docker

- `docker-compose.yml` — запускает базу данных, backend и frontend в контейнерах, а также Python-скрипт экспорта
- `backend/Dockerfile` — собирает образ backend
- `frontend/Dockerfile` — собирает React и кладёт сайт в nginx
- `frontend/nginx.conf` — настройки nginx, запросы на `/api` идут в контейнер backend
- `python/Dockerfile` — образ для скрипта экспорта
- `.dockerignore` — файлы, которые не попадают в образы

### Остальное

- `.gitignore` — файлы, которые не нужно загружать в Git
- `git_commits.sh` — скрипт для создания коммитов

## Что нужно установить

- Node.js 18 или новее
- PostgreSQL
- Python 3.9 или новее

## Как запустить

### 1. Создать базу данных

```bash
psql -U postgres -c "CREATE DATABASE task_manager;"
```

### 2. Запустить backend

```bash
cd backend
npm install
cp .env.example .env
npm run db:init
npm run dev
```

В файле `.env` нужно указать свой логин и пароль от PostgreSQL. Сервер запустится на http://localhost:3000.

Таблицу можно создать и вручную:

```bash
psql -U postgres -d task_manager -f database/schema.sql
```

### 3. Запустить frontend

Открыть второй терминал:

```bash
cd frontend
npm install
npm run dev
```

Сайт откроется на http://localhost:5173.

### 4. Запустить Python-скрипт

```bash
cd python
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python export_tasks.py
```

На Windows вместо `source .venv/bin/activate` пишем `.venv\Scripts\activate`, а вместо `cp` — `copy`.

После запуска появится файл `tasks.csv`.

## Запуск через Docker

Нужен установленный Docker Desktop (он должен быть запущен). Если у вас уже работают backend или frontend из предыдущего раздела, сначала остановите их (Ctrl+C), иначе порт 3000 будет занят.

В папке проекта (где лежит `docker-compose.yml`):

```bash
docker compose up -d --build
```

Первый раз сборка идёт несколько минут. Когда всё запустится, сайт будет доступен на http://localhost:8080, а API на http://localhost:3000/tasks.

Таблица создаётся сама из `database/schema.sql` при первом запуске базы. Файлы `.env` для Docker не нужны, настройки лежат в `docker-compose.yml`.

Выгрузка задач в CSV через Docker:

```bash
docker compose run --rm export
```

Файл `tasks.csv` появится в папке `python`.

Остановить всё:

```bash
docker compose down
```

Чтобы зараз удалить данные базы: `docker compose down -v`.

### Проверка Docker

```bash
docker ps
docker compose logs backend
docker compose logs db
docker compose logs frontend
```

В `docker ps` должны быть три контейнера: `tasks_db`, `tasks_backend` и `tasks_frontend`. В логах backend должна быть строка `API запущен`.

## API

- `GET /tasks` — получить все задачи
- `POST /tasks` — создать задачу (поля `title` и `description`)
- `PUT /tasks/:id` — изменить статус (`new`, `in_progress`, `done`)
- `DELETE /tasks/:id` — удалить задачу

Если что-то не так, сервер возвращает ошибку в виде `{ "error": "текст ошибки" }`.

## Как проверить, что всё работает

### База данных

```bash
psql -U postgres -d task_manager -c '\d tasks'
```

Должна показаться таблица tasks.

### Backend

Сервер запущен, в консоли написано `API запущен: http://localhost:3000`. Дальше можно проверить запросы:

```bash
# создать задачу
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{"title":"Изучить React","description":"Пройти базовый курс"}'

# посмотреть все задачи
curl http://localhost:3000/tasks

# поменять статус
curl -X PUT http://localhost:3000/tasks/1 -H "Content-Type: application/json" -d '{"status":"in_progress"}'

# удалить задачу
curl -X DELETE http://localhost:3000/tasks/1

# проверка ошибки
curl -X POST http://localhost:3000/tasks -H "Content-Type: application/json" -d '{}'
```

### Frontend

Открыть http://localhost:5173 и проверить:

1. Создать задачу через форму — она появляется в таблице
2. Поменять статус через select — после обновления страницы статус остаётся
3. Нажать «Удалить» — задача пропадает

### Python

```bash
cd python
python export_tasks.py
```

В консоли будет написано, сколько задач выгружено. Файл `tasks.csv` можно открыть в Excel.

### Git

```bash
git log --oneline
```

Показывает историю коммитов.
