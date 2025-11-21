// sky-gestor-backend/server.js
import 'dotenv/config'; // Carga las variables de entorno (.env)
import express from 'express';
import cors from 'cors';
import path from 'path'; // Para manejar rutas de archivos, si sirves vistas EJS
import { fileURLToPath } from 'url';

// Importar las rutas definidas
import usuariosRoutes from './src/routes/usuarios.route.js';
import tareasRoutes from './src/routes/tareas.route.js';
import eventosRoutes from './src/routes/eventos.route.js';

// Importar el manejo global de errores
import { globalErrorHandler } from './src/utils/errorHandler.js';

// Importar y probar la conexión a la base de datos
import { testConnection } from './src/config/db.js';

// Para usar __dirname con ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.BACKEND_PORT || 3001; // Puedes definir BACKEND_PORT en tu .env o usa 3001

// Configuración de EJS (si la sigues usando para vistas del backend, como login/registro)
// Si tu frontend es 100% React y ya no usas EJS para estas vistas, puedes remover esta sección.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));
app.use(express.static(path.join(__dirname, 'public'))); // Para archivos estáticos del backend (CSS, JS para EJS)

// Middlewares globales
app.use(cors()); // Habilita CORS para permitir solicitudes desde tu frontend de React
app.use(express.json()); // Para parsear cuerpos de solicitud en formato JSON
app.use(express.urlencoded({ extended: true })); // Para parsear cuerpos de solicitud URL-encoded (formularios tradicionales)

// Montar las rutas de la API con un prefijo (buena práctica)
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/tareas', tareasRoutes);
app.use('/api/eventos', eventosRoutes);

// Ruta raíz del backend
app.get('/', (req, res) => {
  // Si aún usas vistas EJS para el login, podrías redirigir aquí
  // res.redirect('/vista/login');
  // O simplemente enviar un mensaje indicando que la API está funcionando
  res.send('API del Gestor de Horarios funcionando. El frontend se sirve por separado.');
});

// Middleware global para manejo de errores (debe ir al final)
app.use(globalErrorHandler);

// Función para iniciar el servidor
const startServer = async () => {
  try {
    // Probar conexión a la base de datos
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos');
      process.exit(1);
    }
// Al final del archivo, antes de iniciar el servidor
app.use(globalErrorHandler);
    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`✅ Servidor backend escuchando en http://localhost:${PORT}`);
      console.log('✅ Conexión a la base de datos establecida');
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Iniciar la aplicación
startServer();








// // sky-gestor-backend/server.js
// require('dotenv').config(); // Carga las variables de entorno (.env)

// const express = require('express');
// const cors = require('cors');
// const path = require('path'); // Para manejar rutas de archivos, si sirves vistas EJS

// // Importar las rutas definidas
// const usuariosRoutes = require('./src/routes/usuarios.route.js');
// const tareasRoutes = require('./src/routes/tareas.route.js');
// const eventosRoutes = require('./src/routes/eventos.route.js');

// // Importar el manejo global de errores
// const { globalErrorHandler } = require('./src/utils/errorHandler');

// const app = express();
// const PORT = process.env.BACKEND_PORT || 3001; // Puedes definir BACKEND_PORT en tu .env o usa 3001

// // Configuración de EJS (si la sigues usando para vistas del backend, como login/registro)
// // Si tu frontend es 100% React y ya no usas EJS para estas vistas, puedes remover esta sección.
// app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, 'src', 'views'));
// app.use(express.static(path.join(__dirname, 'public'))); // Para archivos estáticos del backend (CSS, JS para EJS)

// // Middlewares globales
// app.use(cors()); // Habilita CORS para permitir solicitudes desde tu frontend de React
// app.use(express.json()); // Para parsear cuerpos de solicitud en formato JSON
// app.use(express.urlencoded({ extended: true })); // Para parsear cuerpos de solicitud URL-encoded (formularios tradicionales)

// // Montar las rutas de la API con un prefijo (buena práctica)
// app.use('/api/usuarios', usuariosRoutes);
// app.use('/api/tareas', tareasRoutes);
// app.use('/api/eventos', eventosRoutes);

// // Ruta raíz del backend
// app.get('/', (req, res) => {
//   // Si aún usas vistas EJS para el login, podrías redirigir aquí
//   // res.redirect('/vista/login');
//   // O simplemente enviar un mensaje indicando que la API está funcionando
//   res.send('API del Gestor de Horarios funcionando. El frontend se sirve por separado.');
// });

// // Middleware global para manejo de errores (debe ir al final)
// app.use(globalErrorHandler);

// // Iniciar el servidor
// app.listen(PORT, () => {
//   console.log(`Servidor backend escuchando en http://localhost:${PORT}`);
//   // La conexión a la base de datos ya se prueba en src/config/db.js al iniciar.
// });

// /* Rutas para las vistas EJS (si las mantienes)
// // Estas son las rutas que me proporcionaste antes.
// // Si ya no las usas porque todo es manejado por React, puedes eliminarlas.
// app.get('/vista/login', (req, res) => {
//   res.render('login'); // Asume que tienes un login.ejs en src/views
// });

// app.get('/vista/registro', (req, res) => {
//   res.render('registro'); // Asume que tienes un registro.ejs en src/views
// });

// app.get('/vista/usuarios', (req, res) => {
//     res.render('usuarios'); // Asume que tienes usuarios.ejs
// });

// app.get('/vista/tareas', (req, res) => {
//     res.render('tareas'); // Asume que tienes tareas.ejs
// });

// app.get('/vista/eventos', (req, res) => {
//     res.render('eventos'); // Asume que tienes eventos.ejs
// });

// app.get('/vista/inicio', (req, res) => {
//   res.render('inicio'); // Asume que tienes inicio.ejs
// });*/

// /* Rutas para las vistas EJS (si las mantienes)
// // Estas son las rutas que me proporcionaste antes.
// // Si ya no las usas porque todo es manejado por React, puedes eliminarlas.
// app.get('/vista/login', (req, res) => {
//   res.render('login'); // Asume que tienes un login.ejs en src/views
// });

// app.get('/vista/registro', (req, res) => {
//   res.render('registro'); // Asume que tienes un registro.ejs en src/views
// });

// app.get('/vista/usuarios', (req, res) => {
//     res.render('usuarios'); // Asume que tienes usuarios.ejs
// });

// app.get('/vista/tareas', (req, res) => {
//     res.render('tareas'); // Asume que tienes tareas.ejs
// });

// app.get('/vista/eventos', (req, res) => {
//     res.render('eventos'); // Asume que tienes eventos.ejs
// });

// app.get('/vista/inicio', (req, res) => {
//   res.render('inicio'); // Asume que tienes inicio.ejs
// });*/

