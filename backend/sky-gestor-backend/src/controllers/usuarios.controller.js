// src/controllers/usuariosController.js
import usuariosService from '../services/usuarios.service.js';
import { catchAsync } from '../utils/errorHandler.js';

// Crear un nuevo usuario (Registro)
export const crearUsuario = catchAsync(async (req, res) => {
  const resultado = await usuariosService.crear(req.body);
  res.status(201).json(resultado);
});

// Iniciar sesión
export const login = catchAsync(async (req, res) => {
  const resultado = await usuariosService.login(req.body);
  res.json(resultado);
});

// Obtener todos los usuarios (requiere autenticación)
export const obtenerUsuarios = catchAsync(async (req, res) => {
  const usuarios = await usuariosService.obtenerTodos();
  res.json(usuarios);
});

// Obtener un usuario por ID (requiere autenticación)
export const obtenerUsuarioPorId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const usuario = await usuariosService.obtenerPorId(parseInt(id));
  res.json(usuario);
});

// Actualizar un usuario (requiere autenticación)
export const actualizarUsuario = catchAsync(async (req, res) => {
  const { id } = req.params;
  const usuarioActualizado = await usuariosService.actualizar(parseInt(id), req.body);
  res.json(usuarioActualizado);
});

// Eliminar un usuario (requiere autenticación)
export const eliminarUsuario = catchAsync(async (req, res) => {
  const { id } = req.params;
  const resultado = await usuariosService.eliminar(parseInt(id));
  res.json(resultado);
});