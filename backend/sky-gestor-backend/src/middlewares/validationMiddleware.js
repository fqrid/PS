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

// Middleware para validar que ningún campo venga vacío
const validateNotEmptyStrings = (req, res, next) => {
  for (const key in req.body) {
    if (req.body[key] === "") {
      return next(new AppError(`El campo ${key} está vacío`, 400));
    }
  }
  next();
};

// Middleware para validar el estado de una tarea
const validateEstadoTarea = (req, res, next) => {
  const estadosValidos = ['pendiente', 'en_progreso', 'completada'];

  if (req.body.estado && !estadosValidos.includes(req.body.estado)) {
    return next(new AppError(
      `Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`,
      400
    ));
  }

  next();
};

// Middleware para validar formato de fecha
const validateDate = (fieldName = 'fecha') => {
  return (req, res, next) => {
    const dateValue = req.body[fieldName];

    if (!dateValue) {
      return next();
    }

    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) {
      return next(new AppError(`${fieldName} tiene un formato inválido`, 400));
    }

    next();
  };
};

// Middleware para validar parámetros de paginación
const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page !== undefined) {
    const pageNum = Number(page);
    if (!Number.isInteger(pageNum) || pageNum < 1) {
      return next(new AppError('El parámetro page debe ser un entero positivo', 400));
    }
  }

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (!Number.isInteger(limitNum) || limitNum < 1 || limitNum > 100) {
      return next(new AppError('El parámetro limit debe ser un entero entre 1 y 100', 400));
    }
  }

  next();
};

// Middleware para validar query params opcionales
const validateQueryParams = (allowedParams) => {
  return (req, res, next) => {
    const queryKeys = Object.keys(req.query);
    const invalidParams = queryKeys.filter(key => !allowedParams.includes(key));

    if (invalidParams.length > 0) {
      return next(new AppError(
        `Parámetros no permitidos: ${invalidParams.join(', ')}. Parámetros válidos: ${allowedParams.join(', ')}`,
        400
      ));
    }

    next();
  };
};

// Función helper para escapar HTML (prevención XSS básica)
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
  };
  return text.replace(/[&<>"'/]/g, (char) => map[char]);
};

// Middleware mejorado para sanitizar datos con protección XSS
const sanitizeDataEnhanced = (req, res, next) => {
  for (const key of Object.keys(req.body)) {
    if (typeof req.body[key] === 'string') {
      // Trim whitespace
      req.body[key] = req.body[key].trim();

      // Opcional: escapar HTML para prevenir XSS (comentado por defecto)
      // Descomenta si necesitas protección XSS estricta
      // req.body[key] = escapeHtml(req.body[key]);
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
  sanitizeData,
  validateNotEmptyStrings,
  validateEstadoTarea,
  validateDate,
  validatePagination,
  validateQueryParams,
  sanitizeDataEnhanced,
  escapeHtml
};