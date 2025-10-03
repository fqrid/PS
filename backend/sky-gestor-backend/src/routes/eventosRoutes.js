// sky-gestor-backend/src/routes/eventosRoutes.js

/**
 * Rutas relacionadas con la gestión de eventos.
 *
 * - Todas las rutas de este módulo requieren autenticación JWT.
 * - Se exponen rutas CRUD estándar para la creación, consulta, 
 *   actualización y eliminación de eventos.
 *
 * Estructura general:
 *   - POST   /     → Crear nuevo evento
 *   - GET    /     → Listar todos los eventos
 *   - GET    /:id  → Obtener evento por ID
 *   - PUT    /:id  → Actualizar evento existente
 *   - DELETE /:id  → Eliminar evento.
 */

const express = require('express');
const router = express.Router();
const eventosController = require('../controllers/eventosController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Middleware global: todas las rutas requieren autenticación
router.use(authenticateToken);

// Rutas CRUD estándar para eventos
router.post('/', eventosController.crearEvento);            // Crear evento
router.get('/', eventosController.obtenerEventos);          // Listar todos los eventos
router.get('/:id', eventosController.obtenerEventoPorId);   // Obtener evento por ID
router.put('/:id', eventosController.actualizarEvento);     // Actualizar evento
router.delete('/:id', eventosController.eliminarEvento);    // Eliminar evento

module.exports = router;
