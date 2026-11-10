import { pool } from '../config/db.js';

const statuses = ['new', 'in_progress', 'done'];

export async function getTasks(req, res, next) {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC, id DESC'
    );
    res.json(result.rows);
  } catch (error) {
    next(error);
  }
}

export async function createTask(req, res, next) {
  try {
    const { title, description } = req.body;

    if (typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Название задачи обязательно' });
    }
    if (title.length > 255) {
      return res.status(400).json({ error: 'Название слишком длинное' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), typeof description === 'string' ? description.trim() : '']
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function updateTask(req, res, next) {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Неверный id' });
    }
    if (!statuses.includes(status)) {
      return res.status(400).json({
        error: 'Статус должен быть: new, in_progress или done',
      });
    }

    const result = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    next(error);
  }
}

export async function deleteTask(req, res, next) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Неверный id' });
    }

    const result = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}
