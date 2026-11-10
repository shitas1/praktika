async function request(url, options) {
  const response = await fetch('/api' + url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (response.status === 204) {
    return null;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Ошибка запроса');
  }
  return data;
}

export function getTasks() {
  return request('/tasks');
}

export function createTask(task) {
  return request('/tasks', { method: 'POST', body: JSON.stringify(task) });
}

export function updateTaskStatus(id, status) {
  return request('/tasks/' + id, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
}

export function deleteTask(id) {
  return request('/tasks/' + id, { method: 'DELETE' });
}
