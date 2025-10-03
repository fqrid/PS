// sky-gestor-backend/src/models/usuarios.js
const pool = require('../config/db');

class Usuario {
  // Crear un nuevo usuario en la base de datos (sin rol).
  static async crear(nombre, correo, contrasena) {
    const query = 'INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)';
    const values = [nombre, correo, contrasena];
    const result = await pool.execute(query, values);
    const [newUser] = await pool.execute('SELECT id, nombre, correo FROM usuarios WHERE id = ?', [result[0].insertId]);
    return newUser[0];
  }

  // Obtener todos los usuarios (útil para selectores, sin contraseñas).
  static async obtenerTodos() {
    const [result] = await pool.execute('SELECT id, nombre, correo FROM usuarios ORDER BY nombre ASC');
    return result;
  }

  // Obtener un usuario por ID (sin contraseña)
  static async obtenerPorId(id) {
    const [result] = await pool.execute('SELECT id, nombre, correo FROM usuarios WHERE id = ?', [id]);
    return result[0];
  }

  // Actualizar un usuario existente (sin rol)
  static async actualizar(id, nombre, correo) {
    const query = 'UPDATE usuarios SET nombre=?, correo=? WHERE id=?';
    const values = [nombre, correo, id];
    await pool.execute(query, values);
    const [updatedUser] = await pool.execute('SELECT id, nombre, correo FROM usuarios WHERE id = ?', [id]);
    return updatedUser[0];
  }

  // Eliminar un usuario
  static async eliminar(id) {
    await pool.execute('DELETE FROM usuarios WHERE id=?', [id]);
    return { message: 'Usuario eliminado' };
  }

  // Buscar usuario por correo (para login, incluye la contraseña hasheada)
  static async buscarPorCorreo(correo) {
    const [result] = await pool.execute('SELECT * FROM usuarios WHERE correo = ?', [correo]);
    return result[0];
  }
}

module.exports = Usuario;
