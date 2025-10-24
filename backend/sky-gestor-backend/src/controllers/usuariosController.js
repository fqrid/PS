const usuariosService = require('../services/usuariosService');
const { catchAsync } = require('../utils/errorHandler');

// Crear un nuevo usuario (Registro)
exports.crearUsuario = catchAsync(async (req, res) => {
  const resultado = await usuariosService.crear(req.body);
  res.status(201).json(resultado);
});

// Iniciar sesión
exports.login = catchAsync(async (req, res) => {
  const resultado = await usuariosService.login(req.body);
  res.json(resultado);
});

// Obtener todos los usuarios (requiere autenticación)
exports.obtenerUsuarios = catchAsync(async (req, res) => {
  const usuarios = await usuariosService.obtenerTodos();
  res.json(usuarios);
});

// Obtener un usuario por ID (requiere autenticación)
exports.obtenerUsuarioPorId = catchAsync(async (req, res) => {
  const { id } = req.params;
  const usuario = await usuariosService.obtenerPorId(id);
  res.json(usuario);
});

// Actualizar un usuario (requiere autenticación)
exports.actualizarUsuario = catchAsync(async (req, res) => {
  const { id } = req.params;
  const usuarioActualizado = await usuariosService.actualizar(id, req.body);
  res.json(usuarioActualizado);
});

// Eliminar un usuario (requiere autenticación)
exports.eliminarUsuario = catchAsync(async (req, res) => {
  const { id } = req.params;
  const resultado = await usuariosService.eliminar(id);
  res.json(resultado);
});
