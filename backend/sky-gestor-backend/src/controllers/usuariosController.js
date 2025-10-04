// sky-gestor-backend/src/controllers/usuariosController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Importar jwt
const Usuario = require('../models/usuarios');

const SECRET_KEY = process.env.JWT_SECRET; // Obtén la clave secreta de las variables de entorno.

// Función para validar la contraseña (al menos 8 caracteres, un símbolo y un número).
function validarContrasena(contrasena) {
  return /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/.test(contrasena);
}

// Crear un nuevo usuario (Registro)
exports.crearUsuario = async (req, res) => {
  try {
    const { nombre, correo, contrasena } = req.body;
    console.log("Datos recibidos en el registro:", req.body);

    if (!nombre || !correo || !contrasena) {
        return res.status(400).json({ error: 'Nombre, correo y contraseña son campos obligatorios.' });
    }

    if (!validarContrasena(contrasena)) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres, un símbolo y un número.' });
    }

    // Verificar si el correo ya existe
    const usuarioExistente = await Usuario.buscarPorCorreo(correo);
    if (usuarioExistente) {
        return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
    }

    const hashedPassword = await bcrypt.hash(contrasena, 10); // 10 es el "cost" (nivel de seguridad)
    const usuario = await Usuario.crear(nombre, correo, hashedPassword);
    res.status(201).json({ message: 'Usuario registrado con éxito', usuario }); // 201 Created
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor al registrar el usuario.' });
  }
};

// Iniciar sesión
exports.login = async (req, res) => {
  try {
    const { correo, contrasena } = req.body;

    console.log('🟡 Intentando login con:', { correo, contrasena });

    const usuario = await Usuario.buscarPorCorreo(correo);
    if (!usuario) {
      console.log('🔴 Usuario no encontrado');
      return res.status(401).json({ error: 'Credenciales inválidas. Usuario no encontrado.' });
    }

    console.log('🟢 Usuario encontrado:', {
      id: usuario.id,
      correo: usuario.correo,
      // No loguear la contraseña hasheada aquí en producción por seguridad
      // hash: usuario.contrasena
    });

    const coincide = await bcrypt.compare(contrasena, usuario.contrasena);
    console.log('🔍 bcrypt.compare result:', coincide);

    if (!coincide) {
      console.log('🔴 Contraseña incorrecta');
      return res.status(401).json({ error: 'Credenciales inválidas. Contraseña incorrecta.' });
    }

    console.log('✅ Login exitoso');

    // Generar JWT incluyendo el ID y el NOMBRE del usuario en el payload
    const token = jwt.sign(
      { id: usuario.id, username: usuario.nombre }, // Payload: id y nombre del usuario
      SECRET_KEY,
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    console.log('Token generado: ', token)

    res.json({
      message: 'Login exitoso',
      token, // Envía el token al cliente
      user: { id: usuario.id, nombre: usuario.nombre, correo: usuario.correo } // Puedes devolver info del usuario también
    });
  } catch (error) {
    console.error('🛑 Error en login:', error);
    res.status(500).json({ error: 'Error interno del servidor durante el inicio de sesión.' });
  }
};

// Obtener todos los usuarios (requiere autenticación)
exports.obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener usuarios.' });
  }
};

// Obtener un usuario por ID (requiere autenticación)
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.obtenerPorId(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener usuario por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener el usuario.' });
  }
};

// Actualizar un usuario (requiere autenticación)
exports.actualizarUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, correo } = req.body;

    // Opcional: Si el usuario que actualiza no es el propio usuario o un admin (que no tenemos aquí),
    // podrías añadir una comprobación: if (req.user.id !== parseInt(id)) { return res.status(403)... }

    const usuarioActualizado = await Usuario.actualizar(id, nombre, correo);
    if (!usuarioActualizado) {
        return res.status(404).json({ error: 'Usuario no encontrado para actualizar.' });
    }
    res.json(usuarioActualizado);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar el usuario.' });
  }
};

// Eliminar un usuario (requiere autenticación)
exports.eliminarUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // Opcional: Podrías añadir una comprobación similar para evitar que un usuario se elimine a sí mismo
    // o para permitir solo a un administrador (que no tenemos) eliminar a otros.
    // if (req.user.id === parseInt(id)) { return res.status(403).json({ error: 'No puedes eliminar tu propia cuenta de esta manera.' }); }


    const usuarioExistente = await Usuario.obtenerPorId(id);
    if (!usuarioExistente) {
        return res.status(404).json({ error: 'Usuario no encontrado para eliminar.' });
    }

    const mensaje = await Usuario.eliminar(id);
    res.json(mensaje);
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el usuario.' });
  }
};
