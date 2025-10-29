// src/utils/AppError.js
export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    // Captura la traza sin incluir este constructor
    Error.captureStackTrace(this, this.constructor);
  }
}

// Función para crear errores comunes
export const createError = (message, statusCode) => {
  return new AppError(message, statusCode);
};

// Errores predefinidos comunes
export const commonErrors = {
  notFound: (resource = 'Recurso') => createError(`${resource} no encontrado`, 404),
  badRequest: (message = 'Solicitud inválida') => createError(message, 400),
  unauthorized: (message = 'No autorizado') => createError(message, 401),
  forbidden: (message = 'Acceso prohibido') => createError(message, 403),
  conflict: (message = 'Conflicto de recursos') => createError(message, 409),
  internalError: (message = 'Error interno del servidor') => createError(message, 500),
  validationError: (message = 'Error de validación') => createError(message, 422)
};