const pool = require('../config/db');

class Evento {
  constructor(id, titulo, descripcion, fecha) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fecha = fecha;
  }

  // Crear un nuevo evento
  static async crear(titulo, descripcion, fecha) {
    const query = 'INSERT INTO eventos (titulo, descripcion, fecha) VALUES (?, ?, ?)';
    const values = [titulo, descripcion, fecha];
    const result = await pool.execute(query, values);
    const [newEvent] = await pool.execute('SELECT id, titulo, descripcion, fecha FROM eventos WHERE id = ?', [result[0].insertId]);
    return new Evento(newEvent[0].id, newEvent[0].titulo, newEvent[0].descripcion, newEvent[0].fecha);
  }

  // Obtener todos los eventos
  static async obtenerTodos() {
    const [result] = await pool.execute('SELECT id, titulo, descripcion, fecha FROM eventos ORDER BY fecha DESC');
    return result.map(row => new Evento(row.id, row.titulo, row.descripcion, row.fecha));
  }

  // Obtener un evento por ID
  static async obtenerPorId(id) {
    const [result] = await pool.execute('SELECT id, titulo, descripcion, fecha FROM eventos WHERE id = ?', [id]);
    if (result.length === 0) return null;
    const row = result[0];
    return new Evento(row.id, row.titulo, row.descripcion, row.fecha);
  }

  // Actualizar un evento
  static async actualizar(id, titulo, descripcion, fecha) {
    const query = 'UPDATE eventos SET titulo=?, descripcion=?, fecha=? WHERE id=?';
    const values = [titulo, descripcion, fecha, id];
    const result = await pool.execute(query, values);
    if (result[0].affectedRows === 0) {
      return null; // No se encontró el evento para actualizar
    }
    const [updatedEvent] = await pool.execute('SELECT id, titulo, descripcion, fecha FROM eventos WHERE id = ?', [id]);
    return new Evento(updatedEvent[0].id, updatedEvent[0].titulo, updatedEvent[0].descripcion, updatedEvent[0].fecha);
  }

  // Eliminar un evento.
  static async eliminar(id) {
    const result = await pool.execute('DELETE FROM eventos WHERE id=?', [id]);
    if (result[0].affectedRows === 0) {
      return { message: 'Evento no encontrado para eliminar', deleted: false };
    }
    return { message: 'Evento eliminado', deleted: true, id };
  }
}

module.exports = Evento;
