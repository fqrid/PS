// sky-gestor-backend/src/models/tareas.js
const pool = require('../config/db');

class Tarea {
  // Constructor para facilitar la creación de objetos Tarea con los nombres asociados.
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
    const result = await pool.query(
      'INSERT INTO tareas (titulo, descripcion, estado, fecha, usuario_asignado_id, evento_asociado_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [titulo, descripcion, estado, fecha, usuarioAsignadoId, eventoAsociadoId]
    );
    const row = result.rows[0];
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
    const result = await pool.query(query);
    return result.rows.map(row => new Tarea(
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
      WHERE t.id = $1
    `;
    const result = await pool.query(query, [id]);
    const row = result.rows[0];
    if (!row) return null;
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
      WHERE t.usuario_asignado_id = $1
      ORDER BY t.fecha ASC
    `;
    const result = await pool.query(query, [usuarioId]);
    return result.rows.map(row => new Tarea(
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
      WHERE t.evento_asociado_id = $1
      ORDER BY t.fecha ASC
    `;
    const result = await pool.query(query, [eventoId]);
    return result.rows.map(row => new Tarea(
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
            WHERE t.evento_asociado_id = $1
            ORDER BY t.fecha DESC;
        `;
        const result = await pool.query(query, [eventoId]);
        return result.rows.map(row => new Tarea(
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

    const result = await pool.query(
      'UPDATE tareas SET titulo=$1, descripcion=$2, estado=$3, fecha=$4, usuario_asignado_id=$5, evento_asociado_id=$6 WHERE id=$7 RETURNING *',
      [titulo, descripcion, estado, fecha, assignedUser, associatedEvent, id]
    );
    const row = result.rows[0];
    return new Tarea(row.id, row.titulo, row.descripcion, row.estado, row.fecha, row.usuario_asignado_id, row.evento_asociado_id);
  }

  // Eliminar una tarea
  static async eliminar(id) {
    await pool.query('DELETE FROM tareas WHERE id=$1', [id]);
    return { message: 'Tarea eliminada' };
  }
}

module.exports = Tarea;
