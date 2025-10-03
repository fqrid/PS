// sky-gestor-backend/src/routes/eventosRoutes.js
const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Aplicar el middleware de autenticación a todas las rutas de eventos.
router.use(authenticateToken);

// Rutas para Eventos (todas protegidas)
router.post('/', eventosController.crearEvento);
router.get('/', eventosController.obtenerEventos);
router.get('/:id', eventosController.obtenerEventoPorId);
router.put('/:id', eventosController.actualizarEvento);
router.delete('/:id', eventosController.eliminarEvento);

module.exports = router;
