// sky-gestor-backend/src/routes/usuariosRoutes.js
const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authenticateToken } = require('../middlewares/authMiddleware'); // Importa el middleware

// Rutas públicas (no requieren token)
router.post('/register', usuariosController.crearUsuario);
router.post('/login', usuariosController.login);

// A partir de aquí, todas las rutas requieren autenticación
// Podríamos aplicar el middleware a cada una o usar router.use(authenticateToken)
// si TODAS las siguientes lo necesitaran. Por especificidad y claridad para este ejemplo, lo aplicaremos individualmente.
// Sin embargo, si todas las rutas de GET, PUT, DELETE para usuarios DEBEN ser protegidas,
// es más limpio usar router.use(authenticateToken) después de las rutas públicas.

// router.use(authenticateToken); // Opción A: Aplicar a todo lo que sigue

// Opción B: Aplicar individualmente (como estaba en tu archivo original o si hubiera alguna ruta GET no protegida)
router.get('/', authenticateToken, usuariosController.obtenerUsuarios);
// router.get('/:id', authenticateToken, usuariosController.obtenerUsuarioPorId); // Esta línea la tenías en tu usuariosController pero no en las rutas originales que te completé. La añado por consistencia.
router.put('/:id', authenticateToken, usuariosController.actualizarUsuario);
router.delete('/:id', authenticateToken, usuariosController.eliminarUsuario);

module.exports = router;