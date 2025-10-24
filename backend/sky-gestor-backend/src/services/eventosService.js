const Evento = require('../models/eventos');

module.exports = {
  async obtenerTodos() {
    return await Evento.obtenerTodos();
  },

  async obtenerPorId(id) {
    return await Evento.obtenerPorId(id);
  },

  async crear(data) {
    const { titulo, descripcion, fecha } = data;
    return await Evento.crear(titulo, descripcion, fecha);
  },

  async actualizar(id, data) {
    const { titulo, descripcion, fecha } = data;
    return await Evento.actualizar(id, titulo, descripcion, fecha);
  },

  async eliminar(id) {
    return await Evento.eliminar(id);
  },

  async obtenerProximas24h() {
    return await Evento.obtenerProximas24Horas();
  }
};
