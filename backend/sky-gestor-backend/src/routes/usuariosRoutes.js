// sky-gestor-backend/src/routes/usuariosRoutes.js

/**
 * Rutas relacionadas con los usuarios.
 * 
 * - Registro y login son rutas públicas (no requieren autenticación).
 * - Listado, actualización y eliminación requieren autenticación con JWT.
 * 
 * Nota: Se podría aplicar `router.use(authenticateToken)` para proteger todas las rutas.
 * posteriores a las públicas. En este caso, se aplica de forma individual para mayor claridad.
 */

const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authenticateToken } = require('../middlewares/authMiddleware'); // Importa el middleware

// Rutas públicas (no requieren token)
router.post('/register', usuariosController.crearUsuario);
router.post('/login', usuariosController.login);

// Rutas protegidas (requieren token)
router.get('/', authenticateToken, usuariosController.obtenerUsuarios);
// router.get('/:id', authenticateToken, usuariosController.obtenerUsuarioPorId); 
router.put('/:id', authenticateToken, usuariosController.actualizarUsuario);
router.delete('/:id', authenticateToken, usuariosController.eliminarUsuario);

module.exports = router;
