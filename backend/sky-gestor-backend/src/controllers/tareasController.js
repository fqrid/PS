// sky-gestor-backend/src/controllers/tareasController.js
const Tarea = require('../models/tareas');
const Usuario = require('../models/usuarios'); // Necesario para obtener la lista de usuarios para selectores
const Evento = require('../models/eventos');   // Necesario para obtener la lista de eventos para selectores

// Crear una tarea
exports.crearTarea = async (req, res) => {
  try {
    const { titulo, descripcion, estado, fecha, usuarioAsignadoId, eventoAsociadoId } = req.body;

    if (!titulo || !descripcion || !fecha) {
      return res.status(400).json({ error: 'Título, descripción y fecha son campos obligatorios.' });
    }

    // Convertir '' a null si el frontend envía un string vacío para IDs
    const finalUsuarioAsignadoId = usuarioAsignadoId === '' ? null : usuarioAsignadoId;
    const finalEventoAsociadoId = eventoAsociadoId === '' ? null : eventoAsociadoId;

    if (finalEventoAsociadoId) {
      const evento = await Evento.obtenerPorId(finalEventoAsociadoId);
      if (!evento) {
        return res.status(400).json({ error: 'Evento no válido' });
      }
    }

    const nuevaTarea = await Tarea.crear(titulo, descripcion, estado, fecha, finalUsuarioAsignadoId, finalEventoAsociadoId);
    res.status(201).json(nuevaTarea);
  } catch (error) {
    console.error('Error al crear tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor al crear la tarea.' });
  }
};

// Obtener todas las tareas
exports.obtenerTareas = async (req, res) => {
  try {
    const tareas = await Tarea.obtenerTodas();
    res.json(tareas);
  } catch (error) {
    console.error('Error al obtener tareas:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener las tareas.' });
  }
};

// Obtener una tarea por ID
exports.obtenerTareaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.obtenerPorId(id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada.' });
    }
    res.json(tarea);
  } catch (error) {
    console.error('Error al obtener tarea por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener la tarea.' });
  }
};

// Actualizar tarea
// Actualizar tarea (versión corregida)
exports.actualizarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { titulo, descripcion, estado, fecha, usuarioAsignadoId, eventoAsociadoId } = req.body;

    const tareaExistente = await Tarea.obtenerPorId(id);
    if (!tareaExistente) {
      return res.status(404).json({ error: 'Tarea no encontrada para actualizar.' });
    }

    // Convertir '' a null
    const finalUsuarioAsignadoId = (usuarioAsignadoId === '' || usuarioAsignadoId === undefined) ? null : usuarioAsignadoId;
    const finalEventoAsociadoId = (eventoAsociadoId === '' || eventoAsociadoId === undefined) ? null : eventoAsociadoId;

    // VALIDACIÓN CORREGIDA (usa los valores procesados)
    if (finalUsuarioAsignadoId) {
      const usuario = await Usuario.obtenerPorId(finalUsuarioAsignadoId);
      if (!usuario) {
        return res.status(400).json({ error: 'Usuario no válido' });
      }
    }

    // VALIDACIÓN PARA EVENTOS (faltaba)
    if (finalEventoAsociadoId) {
      const evento = await Evento.obtenerPorId(finalEventoAsociadoId);
      if (!evento) {
        return res.status(400).json({ error: 'Evento no válido' });
      }
    }

    const tareaActualizada = await Tarea.actualizar(
      id,
      titulo,
      descripcion,
      estado,
      fecha,
      finalUsuarioAsignadoId,
      finalEventoAsociadoId
    );
    
    res.json(tareaActualizada);
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor al actualizar la tarea.' });
  }
};

// Eliminar tarea
exports.eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.obtenerPorId(id);
    if (!tarea) {
      return res.status(404).json({ error: 'Tarea no encontrada para eliminar.' });
    }
    await Tarea.eliminar(id);
    res.json({ message: 'Tarea eliminada con éxito.' });
  } catch (error) {
    console.error('Error al eliminar tarea:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar la tarea.' });
  }
};

// Obtener la lista de usuarios y eventos para los selectores del frontend
exports.obtenerDatosSelectores = async (req, res) => {
  try {
    const usuarios = await Usuario.obtenerTodos(); // Obtener solo ID y nombre
    const eventos = await Evento.obtenerTodos(); // Obtener solo ID y título
    res.json({ usuarios, eventos });
  } catch (error) {
    console.error('Error al obtener datos para selectores:', error);
    res.status(500).json({ error: 'Error interno del servidor al obtener datos para selectores.' });
  }
};


// Obtener tareas por evento asociado (para EventoDetalles)
exports.obtenerTareasPorEvento = async (req, res) => {
    try {
        const { eventoId } = req.params;
        const tareas = await Tarea.obtenerPorEvento(eventoId);
        res.json(tareas);
    } catch (error) {
        console.error('Error al obtener tareas por evento:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener tareas por evento.' });
    }
};

// Obtener tareas por ID de evento
exports.obtenerTareasPorEventoId = async (req, res) => {
    try {
        const { eventoId } = req.params; // Capturamos el ID del evento de los parámetros de la URL
        const tareas = await Tarea.obtenerPorEventoId(eventoId); // Llama al nuevo método en el modelo
        res.json(tareas);
    } catch (error) {
        console.error('Error al obtener tareas por ID de evento:', error);
        res.status(500).json({ error: 'Error interno del servidor al obtener las tareas asociadas al evento.' });
    }
};