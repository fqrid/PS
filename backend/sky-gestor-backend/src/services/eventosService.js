const Evento = require('../models/eventos');
const AppError = require('../utils/AppError');

module.exports = {
  async obtenerTodos() {
    return await Evento.obtenerTodos();
  },

  async obtenerPorId(id) {
    const evento = await Evento.obtenerPorId(id);
    if (!evento) {
      throw new AppError('Evento no encontrado', 404);
    }
    return evento;
  },

  async crear(data) {
    const { titulo, descripcion, fecha, ubicacion, encargado } = data;
    
    // Validación de campos obligatorios
    if (!titulo || !descripcion || !fecha || !ubicacion || !encargado) {
      throw new AppError('Título, descripción, fecha, ubicación y encargado son campos obligatorios', 400);
    }

    return await Evento.crear(titulo, descripcion, fecha, ubicacion, encargado);
  },

  async actualizar(id, data) {
    const { titulo, descripcion, fecha, ubicacion, encargado } = data;

    // Validación de campos obligatorios
    if (!titulo || !descripcion || !fecha || !ubicacion || !encargado) {
      throw new AppError('Título, descripción, fecha, ubicación y encargado son campos obligatorios', 400);
    }

    const eventoActualizado = await Evento.actualizar(id, titulo, descripcion, fecha, ubicacion, encargado);
    if (!eventoActualizado) {
      throw new AppError('Evento no encontrado para actualizar', 404);
    }
    
    return eventoActualizado;
  },

  async eliminar(id) {
    const resultado = await Evento.eliminar(id);
    if (!resultado.deleted) {
      throw new AppError('Evento no encontrado para eliminar', 404);
    }
    return resultado;
  },

  async obtenerProximas24h() {
    return await Evento.obtenerProximas24Horas();
  }
};
