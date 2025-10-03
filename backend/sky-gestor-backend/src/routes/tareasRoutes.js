// sky-gestor-backend/src/routes/tareasRoutes.js
const express = require('express');
const router = express.Router();
const tareasController = require('../controllers/tareasController');
const { authenticateToken } = require('../middlewares/authMiddleware');

// Aplicar el middleware de autenticación a todas las rutas de tareas.
router.use(authenticateToken);

// Rutas para Tareas (todas protegidas)

// Obtener datos para los selectores (usuarios y eventos)
// Es importante que esta ruta más específica vaya ANTES de rutas con parámetros como /:id
router.get('/select-data', tareasController.obtenerDatosSelectores);

// Obtener tareas asociadas a un evento específico
// Esta ruta también debe ir antes de /:id para evitar conflictos
router.get('/event/:eventoId', tareasController.obtenerTareasPorEvento);

// Rutas CRUD estándar para tareas
router.post('/', tareasController.crearTarea);
router.get('/', tareasController.obtenerTareas); // Obtener todas las tareas
router.get('/:id', tareasController.obtenerTareaPorId); // Obtener una tarea específica
router.put('/:id', tareasController.actualizarTarea);
router.delete('/:id', tareasController.eliminarTarea);
// Ruta para obtener tareas asociadas a un evento


module.exports = router;
