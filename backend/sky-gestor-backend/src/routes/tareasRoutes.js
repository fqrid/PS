// sky-gestor-backend/src/routes/tareasRoutes.js

/**
 * Rutas relacionadas con la gestión de tareas.
 *
 * - Todas las rutas de este módulo requieren autenticación JWT.
 * - Se incluye una ruta para obtener datos auxiliares (usuarios y eventos) 
 *   pensada para poblar selectores en el frontend.
 * - Algunas rutas específicas (ej: /select-data, /event/:eventoId). 
 *   se definen ANTES de rutas con parámetros dinámicos (/id) para evitar conflictos de coincidencia.
 * - Incluye validaciones de campos obligatorios y sanitización de datos.
 *
 * Estructura general:
 *   - Datos auxiliares: /select-data
 *   - Relación con eventos: /event/:eventoId
 *   - CRUD estándar de tareas: POST /, GET /, GET /:id, PUT /:id, DELETE /:id
 */

const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const { authenticateToken } = require('../middlewares/authMiddleware');
const { 
  validateRequiredFields, 
  validateId, 
  validateNumericParam,
  sanitizeData 
} = require('../middlewares/validationMiddleware');

// Middleware global: todas las rutas requieren autenticación
router.use(authenticateToken);

// Middleware global: sanitizar datos
router.use(sanitizeData);

// Rutas específicas (se colocan primero por prioridad de coincidencia)
router.get('/select-data', tareasController.obtenerDatosSelectores); // Datos para combos en el frontend
router.get('/event/:eventoId', 
  validateNumericParam('eventoId'),
  tareasController.obtenerTareasPorEvento
); // Tareas filtradas por evento

// Rutas CRUD estándar
router.post('/', 
  validateRequiredFields(['titulo', 'descripcion', 'fecha']),
  tareasController.crearTarea
); // Crear nueva tarea

router.get('/', tareasController.obtenerTareas); // Listar todas las tareas

router.get('/:id', 
  validateId,
  tareasController.obtenerTareaPorId
); // Obtener tarea por ID

router.put('/:id', 
  validateId,
  validateRequiredFields(['titulo', 'descripcion', 'fecha']),
  tareasController.actualizarTarea
); // Actualizar tarea existente

router.delete('/:id', 
  validateId,
  tareasController.eliminarTarea
); // Eliminar tarea

module.exports = router;
