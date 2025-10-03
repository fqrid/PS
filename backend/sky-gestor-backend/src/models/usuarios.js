// sky-gestor-backend/src/models/usuarios.js
const pool = require('../config/db');

class Usuario {
  // Crear un nuevo usuario en la base de datos (sin rol)
  static async crear(nombre, correo, contrasena) {
    const query = 'INSERT INTO usuarios (nombre, correo, contrasena) VALUES ($1, $2, $3) RETURNING id, nombre, correo';
    const values = [nombre, correo, contrasena];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Obtener todos los usuarios (útil para selectores, sin contraseñas)
  static async obtenerTodos() {
    const result = await pool.query('SELECT id, nombre, correo FROM usuarios ORDER BY nombre ASC');
    return result.rows;
  }

  // Obtener un usuario por ID (sin contraseña)
  static async obtenerPorId(id) {
    const result = await pool.query('SELECT id, nombre, correo FROM usuarios WHERE id = $1', [id]);
    return result.rows[0];
  }

  // Actualizar un usuario existente (sin rol)
  static async actualizar(id, nombre, correo) {
    const query = 'UPDATE usuarios SET nombre=$1, correo=$2 WHERE id=$3 RETURNING id, nombre, correo';
    const values = [nombre, correo, id];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Eliminar un usuario
  static async eliminar(id) {
    await pool.query('DELETE FROM usuarios WHERE id=$1', [id]);
    return { message: 'Usuario eliminado' };
  }

  // Buscar usuario por correo (para login, incluye la contraseña hasheada)
  static async buscarPorCorreo(correo) {
    const result = await pool.query('SELECT * FROM usuarios WHERE correo = $1', [correo]);
    return result.rows[0];
  }
}

module.exports = Usuario;