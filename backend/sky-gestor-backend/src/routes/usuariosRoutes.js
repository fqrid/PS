// sky-gestor-backend/src/routes/usuariosRoutes.js

/**
 * Rutas relacionadas con los usuarios.
 * 
 * - Registro y login son rutas públicas (no requieren autenticación).
 * - Listado, actualización y eliminación requieren autenticación con JWT.
 * - Incluye validaciones de campos obligatorios, email y contraseña.
 * 
 * Nota: Se podría aplicar `router.use(authenticateToken)` para proteger todas las rutas.
 * posteriores a las públicas. En este caso, se aplica de forma individual para mayor claridad.
 */

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { 
  validateRequiredFields, 
  validateEmail,
  validatePassword,
  validateId, 
  sanitizeData 
} = require('../middlewares/validationMiddleware');

// Middleware global: sanitizar datos
router.use(sanitizeData);

// Rutas públicas (no requieren token)
router.post('/register', 
  validateRequiredFields(['nombre', 'correo', 'contrasena']),
  validateEmail,
  validatePassword,
  usuariosController.crearUsuario
);

router.post('/login', 
  validateRequiredFields(['correo', 'contrasena']),
  validateEmail,
  usuariosController.login
);

// Rutas protegidas (requieren token)
router.get('/', authenticateToken, usuariosController.obtenerUsuarios);

router.get('/:id', 
  authenticateToken,
  validateId,
  usuariosController.obtenerUsuarioPorId
);

router.put('/:id', 
  authenticateToken,
  validateId,
  validateRequiredFields(['nombre', 'correo']),
  validateEmail,
  usuariosController.actualizarUsuario
);

router.delete('/:id', 
  authenticateToken,
  validateId,
  usuariosController.eliminarUsuario
);

module.exports = router;
