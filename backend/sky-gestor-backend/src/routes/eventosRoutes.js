// sky-gestor-backend/src/routes/eventosRoutes.js

/**
 * Rutas relacionadas con la gestión de eventos.
 *
 * - Todas las rutas de este módulo requieren autenticación JWT.
 * - Se exponen rutas CRUD estándar para la creación, consulta, 
 *   actualización y eliminación de eventos.
 * - Incluye validaciones de campos obligatorios y sanitización de datos.
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
const { 
  validateRequiredFields, 
  validateId, 
  sanitizeData 
} = require('../middlewares/validationMiddleware');

// Middleware global: todas las rutas requieren autenticación
router.use(authenticateToken);

// Middleware global: sanitizar datos
router.use(sanitizeData);

// Rutas específicas (se colocan primero por prioridad de coincidencia)
router.get('/proximas-24h', eventosController.obtenerEventosProximas24h);

router
  .route('/')
  .get(eventosController.obtenerEventos)
  .post(
    validateRequiredFields(['titulo', 'descripcion', 'fecha', 'ubicacion', 'encargado']),
    eventosController.crearEvento
  );

router
  .route('/:id')
  .get(validateId, eventosController.obtenerEventoPorId)
  .put(
    validateId,
    validateRequiredFields(['titulo', 'descripcion', 'fecha', 'ubicacion', 'encargado']),
    eventosController.actualizarEvento
  )
  .delete(validateId, eventosController.eliminarEvento);

module.exports = router;

// Revisado y editado el 24-10-2025
