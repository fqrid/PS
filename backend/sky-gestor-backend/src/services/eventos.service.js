// src/services/eventosService.js
import { AppDataSource } from '../config/db.js';
import { Evento } from '../models/eventos.model.js';
import { AppError } from '../utils/AppError.js';
import { Between } from 'typeorm';

const parseFechaInput = (fechaInput) => {
  if (!fechaInput) {
    return null;
  }

  if (fechaInput instanceof Date) {
    return Number.isNaN(fechaInput.getTime()) ? null : fechaInput;
  }

  if (typeof fechaInput === 'string') {
    const dateOnlyRegex = /^\d{4}-\d{2}-\d{2}$/;
    const trimmed = fechaInput.trim();

    if (dateOnlyRegex.test(trimmed)) {
      return new Date(`${trimmed}T00:00:00`);
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(fechaInput);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

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
      fecha: evento.fecha?.toISOString(),
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
      fecha: evento.fecha?.toISOString(),
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

    const fechaNormalizada = parseFechaInput(fecha);

    if (!fechaNormalizada) {
      throw new AppError('Fecha inválida', 400);
    }

    const evento = this.eventoRepository.create({
      titulo,
      descripcion,
      fecha: fechaNormalizada,
      ubicacion,
      encargado
    });

    await this.eventoRepository.save(evento);

    return {
      id_evento: evento.id_evento,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha?.toISOString(),
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

    const fechaNormalizada = parseFechaInput(fecha);

    if (!fechaNormalizada) {
      throw new AppError('Fecha inválida', 400);
    }

    const evento = await this.eventoRepository.findOne({ 
      where: { id_evento } 
    });
    
    if (!evento) {
      throw new AppError('Evento no encontrado para actualizar', 404);
    }

    evento.titulo = titulo;
    evento.descripcion = descripcion;
    evento.fecha = fechaNormalizada;
    evento.ubicacion = ubicacion;
    evento.encargado = encargado;

    await this.eventoRepository.save(evento);

    return {
      id_evento: evento.id_evento,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha?.toISOString(),
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
    const inicioDelDia = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate());
    const en24Horas = new Date(ahora.getTime() + 24 * 60 * 60 * 1000);

    const eventos = await this.eventoRepository.find({
      where: {
        fecha: Between(inicioDelDia, en24Horas)
      },
      order: { fecha: 'ASC' }
    });

    return eventos.map(evento => ({
      id_evento: evento.id_evento,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha?.toISOString(),
      ubicacion: evento.ubicacion,
      encargado: evento.encargado
    }));
  }
}

export default new EventosService();