import csv
import os

import psycopg2
from dotenv import load_dotenv

load_dotenv()

database_url = os.getenv("DATABASE_URL")
if not database_url:
    print("Не задана переменная DATABASE_URL, смотри .env.example")
    exit(1)

try:
    connection = psycopg2.connect(database_url)
    cursor = connection.cursor()
    cursor.execute(
        "SELECT id, title, description, status, created_at FROM tasks ORDER BY id"
    )
    tasks = cursor.fetchall()
    connection.close()
except psycopg2.Error as error:
    print("Ошибка базы данных:", error)
    exit(1)

with open("tasks.csv", "w", newline="", encoding="utf-8-sig") as file:
    writer = csv.writer(file)
    writer.writerow(["id", "title", "description", "status", "created_at"])
    writer.writerows(tasks)

print("Выгружено задач:", len(tasks))
