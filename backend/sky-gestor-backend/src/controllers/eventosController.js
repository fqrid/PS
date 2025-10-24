const eventosService = require('../services/eventosService');
const { catchAsync } = require('../utils/errorHandler');

// Crear evento
exports.crearEvento = catchAsync(async (req, res) => {
  const nuevoEvento = await eventosService.crear(req.body);
  res.status(201).json(nuevoEvento);
});

// Obtener todos los eventos
exports.obtenerEventos = catchAsync(async (req, res) => {
  const eventos = await eventosService.obtenerTodos();
  res.json(eventos);
});

// Obtener un evento por ID
exports.obtenerEventoPorId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const evento = await eventosService.obtenerPorId(id);
  res.json(evento);
});

// Actualizar evento
exports.actualizarEvento = catchAsync(async (req, res) => {
  const { id } = req.params;
  const eventoActualizado = await eventosService.actualizar(id, req.body);
  res.json(eventoActualizado);
});

// Eliminar evento
exports.eliminarEvento = catchAsync(async (req, res) => {
  const { id } = req.params;
  const resultado = await eventosService.eliminar(id);
  res.json({ message: resultado.message });
});

// Obtener eventos en las próximas 24 horas
exports.obtenerEventosProximas24h = catchAsync(async (req, res) => {
  const eventos = await eventosService.obtenerProximas24h();
  res.json(eventos);
});