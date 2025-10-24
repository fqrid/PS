const { AppError } = require('./AppError');

// Middleware global para manejo de errores
const globalErrorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log del error para debugging
  console.error('Error:', err);

  // Error de validación de Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new AppError(message, 400);
  }

  // Error de duplicado de Mongoose
  if (err.code === 11000) {
    const message = 'Recurso duplicado';
    error = new AppError(message, 400);
  }

  // Error de cast de Mongoose
  if (err.name === 'CastError') {
    const message = 'ID inválido';
    error = new AppError(message, 400);
  }

  // Error de JWT
  if (err.name === 'JsonWebTokenError') {
    const message = 'Token inválido';
    error = new AppError(message, 401);
  }

  // Error de JWT expirado
  if (err.name === 'TokenExpiredError') {
    const message = 'Token expirado';
    error = new AppError(message, 401);
  }

  // Respuesta de error
  res.status(error.statusCode || 500).json({
    status: error.status || 'error',
    message: error.message || 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Función para manejar errores asíncronos
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Función para manejar errores de base de datos
const handleDatabaseError = (err) => {
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

module.exports = {
  globalErrorHandler,
  catchAsync,
  handleDatabaseError
};
