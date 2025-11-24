// src/routes/eventosRoutes.js
import express from 'express';
import { 
  crearEvento, 
  obtenerEventos, 
  obtenerEventoPorId, 
  actualizarEvento, 
  eliminarEvento, 
  obtenerEventosProximas24h 
} from '../controllers/eventos.controller.js';

import { authenticateToken } from '../middlewares/authMiddleware.js';

import { 
  validateRequiredFields, 
  validateId, 
  sanitizeData,
  validateNotEmptyStrings
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

router.use(authenticateToken);
router.use(sanitizeData);

router.get('/proximas-24h', obtenerEventosProximas24h);

router
  .route('/')
  .get(obtenerEventos)
  .post(
    validateRequiredFields(['titulo', 'descripcion', 'fecha', 'ubicacion', 'encargado']),
    validateNotEmptyStrings,
    crearEvento
  );

router
  .route('/:id')
  .get(validateId, obtenerEventoPorId)
  .put(
    validateId,
    validateRequiredFields(['titulo', 'descripcion', 'fecha', 'ubicacion', 'encargado']),
    validateNotEmptyStrings,
    actualizarEvento
  )
  .delete(validateId, eliminarEvento);

export default router;
