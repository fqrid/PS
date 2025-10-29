// src/middlewares/authMiddleware.js
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token de autenticación requerido.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Error al verificar token:', err);
      return res.status(403).json({ error: 'Token inválido o expirado. Por favor, inicia sesión de nuevo.' });
    }
    
    // Ahora user contendrá id_usuario en lugar de id
    req.user = user;
    next();
  });
};

export { authenticateToken };