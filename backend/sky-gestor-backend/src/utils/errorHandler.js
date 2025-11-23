import { AppError } from './AppError.js';
import logger from "./logger.js"; // <- IMPORTANTE

// Función para manejar errores asíncronos
export const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Función para manejar errores de base de datos
export const handleDatabaseError = (err) => {
  if (err.code === 'ER_DUP_ENTRY') {
    return new AppError('Recurso duplicado', 409);
  }
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return new AppError('Referencia inválida', 400);
  }
  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return new AppError('No se puede eliminar: el recurso está siendo utilizado', 409);
  }
  return new AppError('Error de base de datos', 500);
};

// Middleware global para manejo de errores
export const globalErrorHandler = (err, req, res, next) => {

  // 🔥 Añadir logs con Winston
  logger.error({
    message: err.message,
    statusCode: err.statusCode || 500,
    route: req.originalUrl,
    method: req.method,
    stack: err.stack,
  });

  // Si ya es un AppError, úsalo directamente
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  }

  let error = { ...err };
  error.message = err.message;

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // Mongo duplicado
  if (err.code === 11000) {
    error = new AppError('Recurso duplicado', 400);
  }

  // ID inválido
  if (err.name === 'CastError') {
    error = new AppError('ID inválido', 400);
  }

  // JWT inválido
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Token inválido', 401);
  }

  // JWT expirado
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expirado', 401);
  }

  // MySQL / TypeORM errores
  if (err.code && err.code.startsWith('ER_')) {
    error = handleDatabaseError(err);
  }

  // Respuesta final
  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && {
      stack: error.stack,
      details: err
    })
  });
};