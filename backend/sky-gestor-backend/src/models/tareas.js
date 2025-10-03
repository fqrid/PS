// sky-gestor-backend/src/models/tareas.js
const pool = require('../config/db');

class Tarea {
  // Constructor para facilitar la creación de objetos Tarea con los nombres asociados
  constructor(id, titulo, descripcion, estado, fecha, usuarioAsignadoId, eventoAsociadoId, usuarioAsignadoNombre = null, eventoAsociadoTitulo = null) {
        this.id = id;
        this.titulo = titulo;
        this.descripcion = descripcion;
        this.estado = estado;
        this.fecha = fecha; // O fechaLimite, según tu esquema real
        this.usuarioAsignadoId = usuarioAsignadoId;
        this.eventoAsociadoId = eventoAsociadoId;
        this.usuarioAsignadoNombre = usuarioAsignadoNombre; // Propiedad para el nombre del usuario
        this.eventoAsociadoTitulo = eventoAsociadoTitulo; // Propiedad para el título del evento
    }

  // Crear una nueva tarea
  static async crear(titulo, descripcion, estado = 'pendiente', fecha = null, usuarioAsignadoId = null, eventoAsociadoId = null) {
    const query = 'INSERT INTO tareas (titulo, descripcion, estado, fecha, usuario_asignado_id, evento_asociado_id) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [titulo, descripcion, estado, fecha, usuarioAsignadoId, eventoAsociadoId];
    const result = await pool.execute(query, values);
    const [newTask] = await pool.execute('SELECT * FROM tareas WHERE id = ?', [result[0].insertId]);
    const row = newTask[0];
    return new Tarea(row.id, row.titulo, row.descripcion, row.estado, row.fecha, row.usuario_asignado_id, row.evento_asociado_id);
  }

  // Obtener todas las tareas con JOINs para obtener los nombres/títulos asociados
  static async obtenerTodas() {
    const query = `
      SELECT
        t.id,
        t.titulo,
        t.descripcion,
        t.estado,
        t.fecha,
        t.usuario_asignado_id,
        u.nombre AS usuario_asignado_nombre,
        t.evento_asociado_id,
        e.titulo AS evento_asociado_titulo
      FROM tareas t
      LEFT JOIN usuarios u ON t.usuario_asignado_id = u.id
      LEFT JOIN eventos e ON t.evento_asociado_id = e.id
      ORDER BY t.fecha ASC
    `;
    const [result] = await pool.execute(query);
    return result.map(row => new Tarea(
      row.id, row.titulo, row.descripcion, row.estado, row.fecha,
      row.usuario_asignado_id, row.evento_asociado_id, row.usuario_asignado_nombre, row.evento_asociado_titulo
    ));
  }

  // Obtener una tarea por ID con JOINs
  static async obtenerPorId(id) {
    const query = `
      SELECT
        t.id,
        t.titulo,
        t.descripcion,
        t.estado,
        t.fecha,
        t.usuario_asignado_id,
        u.nombre AS usuario_asignado_nombre,
        t.evento_asociado_id,
        e.titulo AS evento_asociado_titulo
      FROM tareas t
      LEFT JOIN usuarios u ON t.usuario_asignado_id = u.id
      LEFT JOIN eventos e ON t.evento_asociado_id = e.id
      WHERE t.id = ?
    `;
    const [result] = await pool.execute(query, [id]);
    if (result.length === 0) return null;
    const row = result[0];
    return new Tarea(
      row.id, row.titulo, row.descripcion, row.estado, row.fecha,
      row.usuario_asignado_id, row.evento_asociado_id, row.usuario_asignado_nombre, row.evento_asociado_titulo
    );
  }

  // Obtener tareas por usuario asignado
  static async obtenerPorUsuario(usuarioId) {
    const query = `
      SELECT
        t.id,
        t.titulo,
        t.descripcion,
        t.estado,
        t.fecha,
        t.usuario_asignado_id,
        u.nombre AS usuario_asignado_nombre,
        t.evento_asociado_id,
        e.titulo AS evento_asociado_titulo
      FROM tareas t
      LEFT JOIN usuarios u ON t.usuario_asignado_id = u.id
      LEFT JOIN eventos e ON t.evento_asociado_id = e.id
      WHERE t.usuario_asignado_id = ?
      ORDER BY t.fecha ASC
    `;
    const [result] = await pool.execute(query, [usuarioId]);
    return result.map(row => new Tarea(
      row.id, row.titulo, row.descripcion, row.estado, row.fecha,
      row.usuario_asignado_id, row.evento_asociado_id, row.usuario_asignado_nombre, row.evento_asociado_titulo
    ));
  }

  // Obtener tareas por evento asociado
  static async obtenerPorEvento(eventoId) {
    const query = `
      SELECT
        t.id,
        t.titulo,
        t.descripcion,
        t.estado,
        t.fecha,
        t.usuario_asignado_id,
        u.nombre AS usuario_asignado_nombre,
        t.evento_asociado_id,
        e.titulo AS evento_asociado_titulo
      FROM tareas t
      LEFT JOIN usuarios u ON t.usuario_asignado_id = u.id
      LEFT JOIN eventos e ON t.evento_asociado_id = e.id
      WHERE t.evento_asociado_id = ?
      ORDER BY t.fecha ASC
    `;
    const [result] = await pool.execute(query, [eventoId]);
    return result.map(row => new Tarea(
      row.id, row.titulo, row.descripcion, row.estado, row.fecha,
      row.usuario_asignado_id, row.evento_asociado_id, row.usuario_asignado_nombre, row.evento_asociado_titulo
    ));
  }
  
  static async obtenerPorEventoId(eventoId) {
        const query = `
            SELECT 
                t.id, t.titulo, t.descripcion, t.estado, t.fecha, t.usuario_asignado_id, t.evento_asociado_id,
                u.nombre AS usuario_asignado_nombre,
                e.titulo AS evento_asociado_titulo
            FROM tareas t
            LEFT JOIN usuarios u ON t.usuario_asignado_id = u.id
            LEFT JOIN eventos e ON t.evento_asociado_id = e.id
            WHERE t.evento_asociado_id = ?
            ORDER BY t.fecha DESC
        `;
        const [result] = await pool.execute(query, [eventoId]);
        return result.map(row => new Tarea(
            row.id,
            row.titulo,
            row.descripcion,
            row.estado,
            row.fecha,
            row.usuario_asignado_id,
            row.evento_asociado_id,
            row.usuario_asignado_nombre,
            row.evento_asociado_titulo
        ));
    }

  // Actualizar una tarea
  static async actualizar(id, titulo, descripcion, estado, fecha, usuarioAsignadoId, eventoAsociadoId) {
    // Convertir '' a null si el frontend envía un string vacío para IDs
    const assignedUser = usuarioAsignadoId === '' ? null : usuarioAsignadoId;
    const associatedEvent = eventoAsociadoId === '' ? null : eventoAsociadoId;

    const query = 'UPDATE tareas SET titulo=?, descripcion=?, estado=?, fecha=?, usuario_asignado_id=?, evento_asociado_id=? WHERE id=?';
    const values = [titulo, descripcion, estado, fecha, assignedUser, associatedEvent, id];
    await pool.execute(query, values);
    const [updatedTask] = await pool.execute('SELECT * FROM tareas WHERE id = ?', [id]);
    const row = updatedTask[0];
    return new Tarea(row.id, row.titulo, row.descripcion, row.estado, row.fecha, row.usuario_asignado_id, row.evento_asociado_id);
  }

  // Eliminar una tarea
  static async eliminar(id) {
    await pool.execute('DELETE FROM tareas WHERE id=?', [id]);
    return { message: 'Tarea eliminada' };
  }
}

module.exports = Tarea;