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
  sanitizeData 
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Middleware global: todas las rutas requieren autenticación
router.use(authenticateToken);

// Middleware global: sanitizar datos
router.use(sanitizeData);

// Rutas específicas (se colocan primero por prioridad de coincidencia)
router.get('/proximas-24h', obtenerEventosProximas24h);

router
  .route('/')
  .get(obtenerEventos)
  .post(
    validateRequiredFields(['titulo', 'descripcion', 'fecha', 'ubicacion', 'encargado']),
    crearEvento
  );

router
  .route('/:id')
  .get(validateId, obtenerEventoPorId)
  .put(
    validateId,
    validateRequiredFields(['titulo', 'descripcion', 'fecha', 'ubicacion', 'encargado']),
    actualizarEvento
  )
  .delete(validateId, eliminarEvento);

export default router;