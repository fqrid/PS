// sky-gestor-backend/src/config/db.js
require('dotenv').config(); // Carga las variables de entorno al inicio

const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Prueba la conexión
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error al conectar con la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos exitosa:', res.rows[0].now);
  }
});

module.exports = pool;