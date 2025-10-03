const pool = require('../config/db');

class Evento {
  // El constructor ahora espera lat y lng directamente,
  // asumiendo que la transformación de geometry a lat/lng se hace en la consulta.
  constructor(id, titulo, descripcion, fecha, lat, lng) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.fecha = fecha;
    // Almacenamos lat y lng como propiedades directas del objeto Evento para consistencia con el frontend
    this.ubicacion = { lat, lng };
  }

  // Crear un nuevo evento
  static async crear(titulo, descripcion, fecha, lat, lng) {
    // Usamos ST_MakePoint para crear un punto geométrico y ST_SetSRID para asignar el sistema de referencia espacial (4326 para WGS 84)
    // Devolvemos también ST_X (longitud) y ST_Y (latitud) de la ubicación guardada.
    const query = `
      INSERT INTO eventos (titulo, descripcion, fecha, ubicacion) 
      VALUES ($1, $2, $3, ST_SetSRID(ST_MakePoint($5, $4), 4326)) 
      RETURNING id, titulo, descripcion, fecha, ST_X(ubicacion) AS lng, ST_Y(ubicacion) AS lat
    `;
    // Nota: ST_MakePoint toma (longitud, latitud)
    const values = [titulo, descripcion, fecha, lat, lng]; // lat es $4, lng es $5
    const result = await pool.query(query, values);
    const row = result.rows[0];
    // Creamos una nueva instancia de Evento con los datos devueltos, incluyendo lat y lng ya transformados
    return new Evento(row.id, row.titulo, row.descripcion, row.fecha, row.lat, row.lng);
  }

  // Obtener todos los eventos
  static async obtenerTodos() {
    // Seleccionamos ST_X (longitud) y ST_Y (latitud) de la columna ubicacion
    const query = `
      SELECT id, titulo, descripcion, fecha, ST_Y(ubicacion) AS lat, ST_X(ubicacion) AS lng 
      FROM eventos 
      ORDER BY fecha DESC
    `;
    const result = await pool.query(query);
    // Mapeamos cada fila a una nueva instancia de Evento
    return result.rows.map(row => new Evento(row.id, row.titulo, row.descripcion, row.fecha, row.lat, row.lng));
  }

  // Obtener un evento por ID
  static async obtenerPorId(id) {
    // Seleccionamos ST_X (longitud) y ST_Y (latitud) de la columna ubicacion
    const query = `
      SELECT id, titulo, descripcion, fecha, ST_Y(ubicacion) AS lat, ST_X(ubicacion) AS lng 
      FROM eventos 
      WHERE id = $1
    `;
    const result = await pool.query(query, [id]);
    const row = result.rows[0];
    if (!row) return null;
    // Creamos una nueva instancia de Evento con los datos devueltos
    return new Evento(row.id, row.titulo, row.descripcion, row.fecha, row.lat, row.lng);
  }

  // Actualizar un evento
  static async actualizar(id, titulo, descripcion, fecha, lat, lng) {
    // Actualizamos la columna ubicacion usando ST_MakePoint y ST_SetSRID
    // Devolvemos también ST_X (longitud) y ST_Y (latitud) de la ubicación actualizada.
    const query = `
      UPDATE eventos 
      SET titulo=$1, descripcion=$2, fecha=$3, ubicacion=ST_SetSRID(ST_MakePoint($6, $5), 4326) 
      WHERE id=$4 
      RETURNING id, titulo, descripcion, fecha, ST_X(ubicacion) AS lng, ST_Y(ubicacion) AS lat
    `;
    // Nota: ST_MakePoint toma (longitud, latitud)
    const values = [titulo, descripcion, fecha, id, lat, lng]; // id es $4, lat es $5, lng es $6
    const result = await pool.query(query, values);
    const row = result.rows[0];
    if (!row) return null; // Podrías manejar el caso de que no se encuentre el evento para actualizar
    // Creamos una nueva instancia de Evento con los datos actualizados
    return new Evento(row.id, row.titulo, row.descripcion, row.fecha, row.lat, row.lng);
  }

  // Eliminar un evento
  static async eliminar(id) {
    const result = await pool.query('DELETE FROM eventos WHERE id=$1 RETURNING id', [id]);
    if (result.rowCount === 0) {
        // Opcional: puedes lanzar un error o devolver algo que indique que no se encontró el evento
        return { message: 'Evento no encontrado para eliminar', deleted: false };
    }
    return { message: 'Evento eliminado', deleted: true, id };
  }
}

module.exports = Evento;