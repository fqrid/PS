// src/routes/tareasRoutes.js
import express from 'express';
import { 
  crearTarea, 
  obtenerTareas, 
  obtenerTareaPorId, 
  actualizarTarea, 
  eliminarTarea, 
  obtenerDatosSelectores,
  obtenerTareasPorEvento
} from '../controllers/tareas.controller.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { 
  validateRequiredFields, 
  validateId, 
  validateNumericParam,
  sanitizeData 
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Middleware global: todas las rutas requieren autenticación
router.use(authenticateToken);

// Middleware global: sanitizar datos
router.use(sanitizeData);

// Rutas específicas (se colocan primero por prioridad de coincidencia)
router.get('/select-data', obtenerDatosSelectores); // Datos para combos en el frontend
router.get('/event/:eventoId', 
  validateNumericParam('eventoId'),
  obtenerTareasPorEvento
); // Tareas filtradas por evento

// Rutas CRUD estándar
router.post('/', 
  validateRequiredFields(['titulo', 'descripcion', 'fecha']),
  crearTarea
); // Crear nueva tarea

router.get('/', obtenerTareas); // Listar todas las tareas

router.get('/:id', 
  validateId,
  obtenerTareaPorId
); // Obtener tarea por ID

router.put('/:id', 
  validateId,
  validateRequiredFields(['titulo', 'descripcion', 'fecha']),
  actualizarTarea
); // Actualizar tarea existente

router.delete('/:id', 
  validateId,
  eliminarTarea
); // Eliminar tarea

export default router;