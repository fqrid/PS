const Tarea = require('../models/tareas');
const Usuario = require('../models/usuarios');
const Evento = require('../models/eventos');
const AppError = require('../utils/AppError');

module.exports = {
  async obtenerTodas() {
    return await Tarea.obtenerTodas();
  },

  async obtenerPorId(id) {
    const tarea = await Tarea.obtenerPorId(id);
    if (!tarea) {
      throw new AppError('Tarea no encontrada', 404);
    }
    return tarea;
  },

  async crear(data) {
    const { titulo, descripcion, estado, fecha, usuarioAsignadoId, eventoAsociadoId } = data;

    // Validación de campos obligatorios
    if (!titulo || !descripcion || !fecha) {
      throw new AppError('Título, descripción y fecha son campos obligatorios', 400);
    }

    // Convertir '' a null si el frontend envía un string vacío para IDs
    const finalUsuarioAsignadoId = usuarioAsignadoId === '' ? null : usuarioAsignadoId;
    const finalEventoAsociadoId = eventoAsociadoId === '' ? null : eventoAsociadoId;

    // Validar usuario si se proporciona
    if (finalUsuarioAsignadoId) {
      const usuario = await Usuario.obtenerPorId(finalUsuarioAsignadoId);
      if (!usuario) {
        throw new AppError('Usuario no válido', 400);
      }
    }

    // Validar evento si se proporciona
    if (finalEventoAsociadoId) {
      const evento = await Evento.obtenerPorId(finalEventoAsociadoId);
      if (!evento) {
        throw new AppError('Evento no válido', 400);
      }
    }

    return await Tarea.crear(titulo, descripcion, estado, fecha, finalUsuarioAsignadoId, finalEventoAsociadoId);
  },

  async actualizar(id, data) {
    const { titulo, descripcion, estado, fecha, usuarioAsignadoId, eventoAsociadoId } = data;

    // Verificar que la tarea existe
    const tareaExistente = await Tarea.obtenerPorId(id);
    if (!tareaExistente) {
      throw new AppError('Tarea no encontrada para actualizar', 404);
    }

    // Convertir '' a null
    const finalUsuarioAsignadoId = (usuarioAsignadoId === '' || usuarioAsignadoId === undefined) ? null : usuarioAsignadoId;
    const finalEventoAsociadoId = (eventoAsociadoId === '' || eventoAsociadoId === undefined) ? null : eventoAsociadoId;

    // Validar usuario si se proporciona
    if (finalUsuarioAsignadoId) {
      const usuario = await Usuario.obtenerPorId(finalUsuarioAsignadoId);
      if (!usuario) {
        throw new AppError('Usuario no válido', 400);
      }
    }

    // Validar evento si se proporciona
    if (finalEventoAsociadoId) {
      const evento = await Evento.obtenerPorId(finalEventoAsociadoId);
      if (!evento) {
        throw new AppError('Evento no válido', 400);
      }
    }

    return await Tarea.actualizar(
      id,
      titulo,
      descripcion,
      estado,
      fecha,
      finalUsuarioAsignadoId,
      finalEventoAsociadoId
    );
  },

  async eliminar(id) {
    const tarea = await Tarea.obtenerPorId(id);
    if (!tarea) {
      throw new AppError('Tarea no encontrada para eliminar', 404);
    }
    
    await Tarea.eliminar(id);
    return { message: 'Tarea eliminada con éxito' };
  },

  async obtenerDatosSelectores() {
    const usuarios = await Usuario.obtenerTodos();
    const eventos = await Evento.obtenerTodos();
    return { usuarios, eventos };
  },

  async obtenerPorEvento(eventoId) {
    return await Tarea.obtenerPorEvento(eventoId);
  }
};
