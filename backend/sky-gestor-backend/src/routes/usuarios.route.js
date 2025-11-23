// Mejoras para routes + mejores Validaciones 
// src/routes/usuariosRoutes.js
import express from 'express';
import { 
  crearUsuario, 
  login, 
  obtenerUsuarios, 
  obtenerUsuarioPorId, 
  actualizarUsuario, 
  eliminarUsuario 
} from '../controllers/usuarios.controller.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { 
  validateRequiredFields, 
  validateEmail,
  validatePassword,
  validateId, 
  sanitizeData 
} from '../middlewares/validationMiddleware.js';

const router = express.Router();

// Middleware global: sanitizar datos
router.use(sanitizeData);

// Rutas públicas (no requieren token)
router.post('/register', 
  validateRequiredFields(['nombre', 'correo', 'contrasena']),
  validateEmail,
  validatePassword,
  crearUsuario
);

router.post('/login', 
  validateRequiredFields(['correo', 'contrasena']),
  validateEmail,
  login
);

// Rutas protegidas (requieren token)
router.get('/', authenticateToken, obtenerUsuarios);

router.get('/:id', 
  authenticateToken,
  validateId,
  obtenerUsuarioPorId
);

router.put('/:id', 
  authenticateToken,
  validateId,
  validateRequiredFields(['nombre', 'correo']),
  validateEmail,
  actualizarUsuario
);

router.delete('/:id', 
  authenticateToken,
  validateId,
  eliminarUsuario
);

export default router;
