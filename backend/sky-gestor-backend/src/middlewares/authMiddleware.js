// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  // El formato esperado es "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Acceso denegado. Token no proporcionado.', 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(new AppError('Token inválido o expirado.', 403));
    }
    // Adjuntar el usuario decodificado a la request
    req.user = user;
    next();
  });
};

export { authenticateToken };