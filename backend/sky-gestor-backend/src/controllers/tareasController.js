const tareasService = require('../services/tareasService');
const { catchAsync } = require('../utils/errorHandler');

// Crear una tarea
exports.crearTarea = catchAsync(async (req, res) => {
  const nuevaTarea = await tareasService.crear(req.body);
  res.status(201).json(nuevaTarea);
});

// Obtener todas las tareas
exports.obtenerTareas = catchAsync(async (req, res) => {
  const tareas = await tareasService.obtenerTodas();
  res.json(tareas);
});

// Obtener una tarea por ID
exports.obtenerTareaPorId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const tarea = await tareasService.obtenerPorId(id);
  res.json(tarea);
});

// Actualizar tarea
exports.actualizarTarea = catchAsync(async (req, res) => {
  const { id } = req.params;
  const tareaActualizada = await tareasService.actualizar(id, req.body);
  res.json(tareaActualizada);
});

// Eliminar tarea
exports.eliminarTarea = catchAsync(async (req, res) => {
  const { id } = req.params;
  const resultado = await tareasService.eliminar(id);
  res.json(resultado);
});

// Obtener la lista de usuarios y eventos para los selectores del frontend
exports.obtenerDatosSelectores = catchAsync(async (req, res) => {
  const datos = await tareasService.obtenerDatosSelectores();
  res.json(datos);
});

// Obtener tareas por evento asociado (para EventoDetalles)
exports.obtenerTareasPorEvento = catchAsync(async (req, res) => {
  const { eventoId } = req.params;
  const tareas = await tareasService.obtenerPorEvento(eventoId);
  res.json(tareas);
});
