// sky-gestor-backend/src/config/db.js
require('dotenv').config(); // Carga las variables de entorno al inicio

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Prueba la conexión
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Conexión a la base de datos MySQL exitosa');
    connection.release();
  } catch (error) {
    console.error('Error al conectar con la base de datos MySQL:', error);
  }
})();

module.exports = pool;