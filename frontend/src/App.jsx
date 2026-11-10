import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTaskStatus, deleteTask } from './api.js';
import TaskForm from './components/TaskForm.jsx';
import TaskTable from './components/TaskTable.jsx';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getTasks()
      .then(setTasks)
      .catch((e) => setError(e.message));
  }, []);

  async function addTask(task) {
    try {
      const newTask = await createTask(task);
      setTasks([newTask, ...tasks]);
      setError('');
      return true;
    } catch (e) {
      setError(e.message);
      return false;
    }
  }

  async function changeStatus(id, status) {
    try {
      const updated = await updateTaskStatus(id, status);
      setTasks(tasks.map((task) => (task.id === id ? updated : task)));
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  async function removeTask(id) {
    try {
      await deleteTask(id);
      setTasks(tasks.filter((task) => task.id !== id));
      setError('');
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="container">
      <h1>Задачи</h1>
      <TaskForm onAdd={addTask} />
      {error && <p className="error">{error}</p>}
      <TaskTable
        tasks={tasks}
        onChangeStatus={changeStatus}
        onDelete={removeTask}
      />
    </main>
  );
}
