// src/middlewares/validationMiddleware.js
import { AppError } from '../utils/AppError.js';

// Middleware para validar campos obligatorios
const validateRequiredFields = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = requiredFields.filter(field => !req.body[field]);
    if (missingFields.length > 0) {
      const message = `Los siguientes campos son obligatorios: ${missingFields.join(', ')}`;
      return next(new AppError(message, 400));
    }
    next();
  };
};

// Middleware para validar formato de email
const validateEmail = (req, res, next) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (req.body.correo && !emailRegex.test(req.body.correo)) {
    return next(new AppError('Formato de email inválido', 400));
  }
  next();
};

// Middleware para validar contraseña
const validatePassword = (req, res, next) => {
  const passwordRegex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.{8,})/;
  if (req.body.contrasena && !passwordRegex.test(req.body.contrasena)) {
    return next(new AppError('La contraseña debe tener al menos 8 caracteres, un símbolo y un número', 400));
  }
  next();
};

// Middleware para validar ID de parámetros
// Compatible con diferentes nombres de parámetro (id, id_evento, eventoId, usuarioId, etc.)
// y acepta IDs numéricos positivos o UUIDs.
const validateId = (req, res, next) => {
  // Intentar obtener 'id' directamente
  let id = req.params.id;

  // Si no existe, buscar una key en params que parezca un id (contenga 'id' o empiece con 'id_')
  if (!id) {
    const candidateKey = Object.keys(req.params).find((k) => {
      const key = k.toLowerCase();
      return key === 'id' || key.startsWith('id_') || key.endsWith('id') || key.includes('id');
    });

    if (candidateKey) {
      id = req.params[candidateKey];
      // Normalizar: dejar siempre disponible en req.params.id para downstream
      req.params.id = id;
    }
  }

  const isPositiveInteger = (val) => {
    const n = Number(val);
    return Number.isInteger(n) && n > 0;
  };

  const isUUID = (val) => {
    if (typeof val !== 'string') return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
  };

  if (!id || !(isPositiveInteger(id) || isUUID(id))) {
    return next(new AppError('ID inválido', 400));
  }

  next();
};

// Middleware para validar cualquier parámetro numérico
const validateNumericParam = (paramName) => {
  return (req, res, next) => {
    const paramValue = req.params[paramName];
    if (!paramValue || !Number.isInteger(Number(paramValue)) || Number(paramValue) <= 0) {
      return next(new AppError(`${paramName} inválido`, 400));
    }
    next();
  };
};

// Middleware para sanitizar datos
const sanitizeData = (req, res, next) => {
  for (const key of Object.keys(req.body)) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim();
    }
  }
  next();
};

// Exportar todos los middlewares
export {
  validateRequiredFields,
  validateEmail,
  validatePassword,
  validateId,
  validateNumericParam,
  sanitizeData
};