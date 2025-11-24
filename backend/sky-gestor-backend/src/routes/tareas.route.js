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
  sanitizeData,
  validateNotEmptyStrings
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(sanitizeData);

router.get('/select-data', obtenerDatosSelectores);

router.get(
  '/event/:eventoId', 
  validateNumericParam('eventoId'),
  obtenerTareasPorEvento
);

router.post(
  '/', 
  validateRequiredFields(['titulo', 'descripcion', 'fecha']),
  validateNotEmptyStrings,
  crearTarea
);

router.get('/', obtenerTareas);

router.get(
  '/:id', 
  validateId,
  obtenerTareaPorId
);

router.put(
  '/:id', 
  validateId,
  validateRequiredFields(['titulo', 'descripcion', 'fecha']),
  validateNotEmptyStrings,
  actualizarTarea
);

router.delete(
  '/:id', 
  validateId,
  eliminarTarea
);

export default router;
