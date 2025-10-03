const Evento = require('../models/eventos'); 

// Crear evento
exports.crearEvento = async (req, res) => {
  try {
    const { titulo, descripcion, fecha, lat, lng } = req.body; 
    // Validación de campos obligatorios
    if (!titulo || !descripcion || !fecha || lat === undefined || lng === undefined) { 
        return res.status(400).json({ error: 'Título, descripción, fecha, latitud y longitud son campos obligatorios.' }); 
    }
    // Validación de que lat y lng sean números
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) { 
        return res.status(400).json({ error: 'Latitud y Longitud deben ser números válidos.' }); 
    }

    // Llama al método crear del modelo Evento, que ahora maneja ST_MakePoint
    const nuevoEvento = await Evento.crear(titulo, descripcion, fecha, parseFloat(lat), parseFloat(lng)); 
    // El nuevoEvento devuelto por el modelo ya tendrá el formato { id, titulo, ..., ubicacion: { lat, lng } }
    res.status(201).json(nuevoEvento); 
  } catch (error) {
    console.error('Error al crear evento:', error); 
    res.status(500).json({ error: 'Error interno del servidor al crear el evento.' }); 
  }
};

// Obtener todos los eventos
exports.obtenerEventos = async (req, res) => {
  try {
    const eventos = await Evento.obtenerTodos(); 
    // El modelo Evento.obtenerTodos() ahora devuelve objetos Evento con ubicacion: { lat, lng }
    res.json(eventos); 
  } catch (error) {
    console.error('Error al obtener eventos:', error); 
    res.status(500).json({ error: 'Error interno del servidor al obtener los eventos.' }); 
  }
};

// Obtener un evento por ID
exports.obtenerEventoPorId = async (req, res) => {
  try {
    const { id } = req.params; 
    const evento = await Evento.obtenerPorId(id); 
    if (!evento) {
      return res.status(404).json({ error: 'Evento no encontrado.' }); 
    }
    // El modelo Evento.obtenerPorId(id) ahora devuelve un objeto Evento con ubicacion: { lat, lng }
    res.json(evento); 
  } catch (error) {
    console.error('Error al obtener evento por ID:', error); 
    res.status(500).json({ error: 'Error interno del servidor al obtener el evento.' }); 
  }
};

// Actualizar evento
exports.actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params; 
    const { titulo, descripcion, fecha, lat, lng } = req.body; 

    // Opcional: Podrías llamar a Evento.obtenerPorId(id) primero para asegurar que existe,
    // aunque el método actualizar del modelo también podría manejar el caso de no encontrarlo.
    // const eventoExistente = await Evento.obtenerPorId(id);
    // if (!eventoExistente) {
    //     return res.status(404).json({ error: 'Evento no encontrado para actualizar.' });
    // }

    // Validación de campos obligatorios
    if (!titulo || !descripcion || !fecha || lat === undefined || lng === undefined) { 
        return res.status(400).json({ error: 'Título, descripción, fecha, latitud y longitud son campos obligatorios.' }); 
    }
    // Validación de que lat y lng sean números
    if (isNaN(parseFloat(lat)) || isNaN(parseFloat(lng))) { 
        return res.status(400).json({ error: 'Latitud y Longitud deben ser números válidos.' }); 
    }

    const eventoActualizado = await Evento.actualizar(id, titulo, descripcion, fecha, parseFloat(lat), parseFloat(lng)); 
    if (!eventoActualizado) { // Si el modelo devuelve null porque no encontró el ID
        return res.status(404).json({ error: 'Evento no encontrado para actualizar.' });
    }
    // El eventoActualizado devuelto por el modelo ya tendrá el formato { id, titulo, ..., ubicacion: { lat, lng } }
    res.json(eventoActualizado); 
  } catch (error) {
    console.error('Error al actualizar evento:', error); 
    res.status(500).json({ error: 'Error interno del servidor al actualizar el evento.' }); 
  }
};

// Eliminar evento
exports.eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params; 

    // Opcional: verificar si el evento existe antes de intentar eliminarlo.
    // const eventoExistente = await Evento.obtenerPorId(id); // [cite: 292]
    // if (!eventoExistente) { 
    //     return res.status(404).json({ error: 'Evento no encontrado para eliminar.' }); /
    // }

    const resultado = await Evento.eliminar(id); 
    if (!resultado.deleted) { // Usando la propiedad 'deleted' que añadimos al modelo
        return res.status(404).json({ error: 'Evento no encontrado para eliminar.' });
    }
    res.json({ message: resultado.message }); 
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ error: 'Error interno del servidor al eliminar el evento.' }); 
  }
};