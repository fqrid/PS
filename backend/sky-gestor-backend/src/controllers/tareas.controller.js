// src/controllers/tareasController.js
import tareasService from '../services/tareas.service.js';
import { catchAsync } from '../utils/errorHandler.js';

// Crear una tarea
export const crearTarea = catchAsync(async (req, res) => {
  const nuevaTarea = await tareasService.crear(req.body);
  res.status(201).json(nuevaTarea);
});

// Obtener todas las tareas
export const obtenerTareas = catchAsync(async (req, res) => {
  const tareas = await tareasService.obtenerTodas();
  res.json(tareas);
});

// Obtener una tarea por ID
export const obtenerTareaPorId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const tarea = await tareasService.obtenerPorId(parseInt(id));
  res.json(tarea);
});

// Actualizar tarea
export const actualizarTarea = catchAsync(async (req, res) => {
  const { id } = req.params;
  const tareaActualizada = await tareasService.actualizar(parseInt(id), req.body);
  res.json(tareaActualizada);
});

// Eliminar tarea
export const eliminarTarea = catchAsync(async (req, res) => {
  const { id } = req.params;
  const resultado = await tareasService.eliminar(parseInt(id));
  res.json(resultado);
});

// Obtener la lista de usuarios y eventos para los selectores del frontend
export const obtenerDatosSelectores = catchAsync(async (req, res) => {
  const datos = await tareasService.obtenerDatosSelectores();
  res.json(datos);
});

// Obtener tareas por evento asociado (para EventoDetalles)
export const obtenerTareasPorEvento = catchAsync(async (req, res) => {
  const { eventoId } = req.params;
  const tareas = await tareasService.obtenerPorEvento(parseInt(eventoId));
  res.json(tareas);
});