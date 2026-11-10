import { useState } from 'react';

export default function TaskForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const ok = await onAdd({ title, description });
    if (ok) {
      setTitle('');
      setDescription('');
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Название
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Изучить React"
          required
        />
      </label>
      <label>
        Описание
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Пройти базовый курс"
          rows={2}
        />
      </label>
      <button type="submit">Добавить задачу</button>
    </form>
  );
}
