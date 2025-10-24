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
const { authenticateToken } = require('../middlewares/authMiddleware');
const eventosController = require('../controllers/eventosController');

router.use(authenticateToken);

router.get('/proximas-24h', eventosController.obtenerEventosProximas24h);

router
  .route('/')
  .get(eventosController.obtenerEventos)
  .post(eventosController.crearEvento);

router
  .route('/:id')
  .get(eventosController.obtenerEventoPorId)
  .put(eventosController.actualizarEvento)
  .delete(eventosController.eliminarEvento);

module.exports = router;

// Revisado y editado el 24-10-2025
