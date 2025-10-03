// sky-gestor-backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

// Asegúrate de que esta clave secreta sea la misma que usas para firmar el JWT en el login
const SECRET_KEY = process.env.JWT_SECRET; // Obtén la clave secreta de las variables de entorno

const authenticateToken = (req, res, next) => {
  // Obtener el token del encabezado Authorization
  const authHeader = req.headers['authorization'];
  // Formato: Bearer TOKEN
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado. Token de autenticación requerido.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.error('Error al verificar token:', err);
      // 403 Forbidden para token inválido o expirado
      return res.status(403).json({ error: 'Token inválido o expirado. Por favor, inicia sesión de nuevo.' });
    }
    // El payload del token (lo que se firmó) se adjunta a req.user
    // En nuestro caso, `user` contendrá { id: usuario.id, username: usuario.nombre }
    req.user = user;
    next(); // Continúa con la siguiente función de middleware o controlador
  });
};

module.exports = {
  authenticateToken
};
