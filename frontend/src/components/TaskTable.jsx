const statusNames = {
  new: 'Новая',
  in_progress: 'В работе',
  done: 'Выполнена',
};

export default function TaskTable({ tasks, onChangeStatus, onDelete }) {
  if (tasks.length === 0) {
    return <p className="empty">Задач пока нет</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>Создана</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className={task.status === 'done' ? 'done' : ''}>{task.title}</td>
              <td>{task.description}</td>
              <td>
                <select
                  value={task.status}
                  onChange={(e) => onChangeStatus(task.id, e.target.value)}
                >
                  {Object.keys(statusNames).map((status) => (
                    <option key={status} value={status}>
                      {statusNames[status]}
                    </option>
                  ))}
                </select>
              </td>
              <td>{new Date(task.created_at).toLocaleString('ru-RU')}</td>
              <td>
                <button className="danger" onClick={() => onDelete(task.id)}>
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
