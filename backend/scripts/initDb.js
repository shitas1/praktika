import { readFile } from 'node:fs/promises';
import { pool } from '../src/config/db.js';

try {
  const sql = await readFile('../database/schema.sql', 'utf-8');
  await pool.query(sql);
  console.log('Таблица tasks создана');
} catch (error) {
  console.log('Ошибка:', error.message);
}

await pool.end();
