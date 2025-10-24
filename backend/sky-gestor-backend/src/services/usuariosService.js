const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarios');
const AppError = require('../utils/AppError');

const SECRET_KEY = process.env.JWT_SECRET;

// Función para validar la contraseña (al menos 8 caracteres, un símbolo y un número)
function validarContrasena(contrasena) {
  return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/.test(contrasena);
}

module.exports = {
  async crear(data) {
    const { nombre, correo, contrasena } = data;

    // Validación de campos obligatorios
    if (!nombre || !correo || !contrasena) {
      throw new AppError('Nombre, correo y contraseña son campos obligatorios', 400);
    }

    // Validación de contraseña
    if (!validarContrasena(contrasena)) {
      throw new AppError('La contraseña debe tener al menos 8 caracteres, un símbolo y un número', 400);
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.buscarPorCorreo(correo);
    if (usuarioExistente) {
      throw new AppError('El correo electrónico ya está registrado', 409);
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const usuario = await Usuario.crear(nombre, correo, hashedPassword);
    
    return {
      message: 'Usuario registrado con éxito',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo
      }
    };
  },

  async login(data) {
    const { correo, contrasena } = data;

    const usuario = await Usuario.buscarPorCorreo(correo);
    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Generar JWT
    const token = jwt.sign(
      { id: usuario.id, username: usuario.nombre },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return {
      message: 'Login exitoso',
      token,
      user: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo
      }
    };
  },

  async obtenerTodos() {
    return await Usuario.obtenerTodos();
  },

  async obtenerPorId(id) {
    const usuario = await Usuario.obtenerPorId(id);
    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }
    return usuario;
  },

  async actualizar(id, data) {
    const { nombre, correo } = data;

    const usuarioActualizado = await Usuario.actualizar(id, nombre, correo);
    if (!usuarioActualizado) {
      throw new AppError('Usuario no encontrado para actualizar', 404);
    }
    
    return usuarioActualizado;
  },

  async eliminar(id) {
    const usuarioExistente = await Usuario.obtenerPorId(id);
    if (!usuarioExistente) {
      throw new AppError('Usuario no encontrado para eliminar', 404);
    }

    return await Usuario.eliminar(id);
  }
};
