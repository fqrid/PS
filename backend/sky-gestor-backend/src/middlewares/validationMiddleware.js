const { AppError } = require('../utils/AppError');

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
const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
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
  // Sanitizar strings eliminando espacios extra
  for (const key of Object.keys(req.body)) {
    if (typeof req.body[key] === 'string') {
      req.body[key] = req.body[key].trim();
    }
  }
  
  next();
};

module.exports = {
  validateRequiredFields,
  validateEmail,
  validatePassword,
  validateId,
  validateNumericParam,
  sanitizeData
};
