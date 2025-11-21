// src/controllers/eventosController.js
import eventosService from '../services/eventos.service.js';
import { catchAsync } from '../utils/errorHandler.js';

// Crear evento
export const crearEvento = catchAsync(async (req, res) => {
  const nuevoEvento = await eventosService.crear(req.body);
  res.status(201).json(nuevoEvento);
});

// Obtener todos los eventos
export const obtenerEventos = catchAsync(async (req, res) => {
  const eventos = await eventosService.obtenerTodos();
  res.json(eventos);
});

// Obtener un evento por ID
export const obtenerEventoPorId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const evento = await eventosService.obtenerPorId(parseInt(id));
  res.json(evento);
});

// Actualizar evento
export const actualizarEvento = catchAsync(async (req, res) => {
  const { id } = req.params;
  const eventoActualizado = await eventosService.actualizar(parseInt(id), req.body);
  res.json(eventoActualizado);
});

// Eliminar evento
export const eliminarEvento = catchAsync(async (req, res) => {
  const { id } = req.params;
  const resultado = await eventosService.eliminar(parseInt(id));
  res.json({ message: resultado.message });
});

// Obtener eventos en las próximas 24 horas
export const obtenerEventosProximas24h = catchAsync(async (req, res) => {
  const eventos = await eventosService.obtenerProximas24h();
  res.json(eventos);
});