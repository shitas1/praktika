export function notFound(req, res) {
  res.status(404).json({ error: 'Маршрут не найден' });
}

export function errorHandler(err, req, res, next) {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Некорректный JSON' });
  }
  console.log(err);
  res.status(500).json({ error: 'Ошибка сервера' });
}
