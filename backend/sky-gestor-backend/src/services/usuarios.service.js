// src/services/usuariosService.js
import { AppDataSource } from '../config/db.js';
import { Usuario } from '../models/usuarios.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

const SECRET_KEY = process.env.JWT_SECRET;

// Función para validar la contraseña
function validarContrasena(contrasena) {
  return /^(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/.test(contrasena);
}

class UsuariosService {
  constructor() {
    this.usuarioRepository = AppDataSource.getRepository(Usuario);
  }

  async crear(data) {
    const { nombre, correo, contrasena } = data;

    // Validación de campos obligatorios
    if (!nombre || !correo || !contrasena) {
      throw new AppError(
        'Nombre, correo y contraseña son campos obligatorios',
        400
      );
    }

    // Validación de contraseña
    if (!validarContrasena(contrasena)) {
      throw new AppError(
        'La contraseña debe tener al menos 8 caracteres, un símbolo y un número',
        400
      );
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await this.usuarioRepository.findOne({
      where: { correo },
    });
    if (usuarioExistente) {
      throw new AppError('El correo electrónico ya está registrado', 409);
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const usuario = this.usuarioRepository.create({
      nombre,
      correo,
      contrasena: hashedPassword,
    });

    await this.usuarioRepository.save(usuario);

    return {
      message: 'Usuario registrado con éxito',
      usuario: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    };
  }

  async login(data) {
    const { correo, contrasena } = data;

    const usuario = await this.usuarioRepository.findOne({ where: { correo } });
    if (!usuario) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!coincide) {
      throw new AppError('Credenciales inválidas', 401);
    }

    // Generar JWT
    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        username: usuario.nombre,
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    // Mostrar token en consola
    console.log('🔑 Token generado:', token);
    
    return {
      message: 'Login exitoso',
      token,
      user: {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        correo: usuario.correo,
      },
    };
  }

  async obtenerTodos() {
    const usuarios = await this.usuarioRepository.find({
      select: ['id_usuario', 'nombre', 'correo', 'creado_en'],
      order: { nombre: 'ASC' },
    });

    return usuarios.map((usuario) => ({
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      creado_en: usuario.creado_en,
    }));
  }

  async obtenerPorId(id_usuario) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario },
      select: ['id_usuario', 'nombre', 'correo', 'creado_en', 'actualizado_en'],
    });

    if (!usuario) {
      throw new AppError('Usuario no encontrado', 404);
    }

    return {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      creado_en: usuario.creado_en,
      actualizado_en: usuario.actualizado_en,
    };
  }

  async actualizar(id_usuario, data) {
    const { nombre, correo } = data;

    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario },
    });
    if (!usuario) {
      throw new AppError('Usuario no encontrado para actualizar', 404);
    }

    // Verificar si el correo ya existe en otro usuario
    if (correo !== usuario.correo) {
      const correoExistente = await this.usuarioRepository.findOne({
        where: { correo },
      });
      if (correoExistente) {
        throw new AppError('El correo electrónico ya está en uso', 409);
      }
    }

    usuario.nombre = nombre;
    usuario.correo = correo;

    await this.usuarioRepository.save(usuario);

    return {
      id_usuario: usuario.id_usuario,
      nombre: usuario.nombre,
      correo: usuario.correo,
      actualizado_en: usuario.actualizado_en,
    };
  }

  async eliminar(id_usuario) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id_usuario },
    });
    if (!usuario) {
      throw new AppError('Usuario no encontrado para eliminar', 404);
    }

    await this.usuarioRepository.remove(usuario);

    return { message: 'Usuario eliminado' };
  }
}

export default new UsuariosService();
