// src/services/eventosService.js
import { AppDataSource } from '../config/db.js';
import { Evento } from '../models/eventos.model.js';
import { AppError } from '../utils/AppError.js';
import { Between } from 'typeorm';

class EventosService {
  constructor() {
    this.eventoRepository = AppDataSource.getRepository(Evento);
  }

  async obtenerTodos() {
    const eventos = await this.eventoRepository.find({
      order: { fecha: 'DESC' }
    });
    
    return eventos.map(evento => ({
      id_evento: evento.id_evento,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      ubicacion: evento.ubicacion,
      encargado: evento.encargado,
      creado_en: evento.creado_en,
      actualizado_en: evento.actualizado_en
    }));
  }

  async obtenerPorId(id_evento) {
    const evento = await this.eventoRepository.findOne({
      where: { id_evento }
    });

    if (!evento) {
      throw new AppError('Evento no encontrado', 404);
    }

    return {
      id_evento: evento.id_evento,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      ubicacion: evento.ubicacion,
      encargado: evento.encargado,
      creado_en: evento.creado_en,
      actualizado_en: evento.actualizado_en
    };
  }

  async crear(data) {
    const { titulo, descripcion, fecha, ubicacion, encargado } = data;
    
    // Validación de campos obligatorios
    if (!titulo || !descripcion || !fecha || !ubicacion || !encargado) {
      throw new AppError('Título, descripción, fecha, ubicación y encargado son campos obligatorios', 400);
    }

    const evento = this.eventoRepository.create({
      titulo,
      descripcion,
      fecha: new Date(fecha),
      ubicacion,
      encargado
    });

    await this.eventoRepository.save(evento);

    return {
      id_evento: evento.id_evento,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      ubicacion: evento.ubicacion,
      encargado: evento.encargado,
      creado_en: evento.creado_en
    };
  }

  async actualizar(id_evento, data) {
    const { titulo, descripcion, fecha, ubicacion, encargado } = data;

    // Validación de campos obligatorios
    if (!titulo || !descripcion || !fecha || !ubicacion || !encargado) {
      throw new AppError('Título, descripción, fecha, ubicación y encargado son campos obligatorios', 400);
    }

    const evento = await this.eventoRepository.findOne({ 
      where: { id_evento } 
    });
    
    if (!evento) {
      throw new AppError('Evento no encontrado para actualizar', 404);
    }

    evento.titulo = titulo;
    evento.descripcion = descripcion;
    evento.fecha = new Date(fecha);
    evento.ubicacion = ubicacion;
    evento.encargado = encargado;

    await this.eventoRepository.save(evento);

    return {
      id_evento: evento.id_evento,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      ubicacion: evento.ubicacion,
      encargado: evento.encargado,
      actualizado_en: evento.actualizado_en
    };
  }

  async eliminar(id_evento) {
    const evento = await this.eventoRepository.findOne({ 
      where: { id_evento } 
    });
    
    if (!evento) {
      throw new AppError('Evento no encontrado para eliminar', 404);
    }

    await this.eventoRepository.remove(evento);

    return { 
      message: 'Evento eliminado', 
      deleted: true, 
      id_evento 
    };
  }

  async obtenerProximas24h() {
    const ahora = new Date();
    const en24Horas = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

    const eventos = await this.eventoRepository.find({
      where: {
        fecha: Between(ahora, en24Horas)
      },
      order: { fecha: 'ASC' }
    });

    return eventos.map(evento => ({
      id_evento: evento.id_evento,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha,
      ubicacion: evento.ubicacion,
      encargado: evento.encargado
    }));
  }
}

export default new EventosService();