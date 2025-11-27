// src/services/eventosService.js
import { AppDataSource } from '../config/db.js';
import { Evento } from '../models/eventos.model.js';
import { AppError } from '../utils/AppError.js';
import { Between, MoreThanOrEqual, LessThanOrEqual } from 'typeorm';
import { parseFechaInput, parseFechaOrThrow } from '../utils/dateUtils.js';

class EventosService {
  constructor() {
    this.eventoRepository = AppDataSource.getRepository(Evento);
  }

  async obtenerTodos(filters = {}) {
    const { fechaInicio, fechaFin, page, limit } = filters;

    // Construir condiciones de filtrado
    const where = {};

    if (fechaInicio && fechaFin) {
      const inicio = parseFechaInput(fechaInicio);
      const fin = parseFechaInput(fechaFin);
      if (inicio && fin) {
        where.fecha = Between(inicio, fin);
      }
    } else if (fechaInicio) {
      const inicio = parseFechaInput(fechaInicio);
      if (inicio) {
        where.fecha = MoreThanOrEqual(inicio);
      }
    } else if (fechaFin) {
      const fin = parseFechaInput(fechaFin);
      if (fin) {
        where.fecha = LessThanOrEqual(fin);
      }
    }

    // Paginación
    const queryOptions = {
      where: Object.keys(where).length > 0 ? where : undefined,
      order: { fecha: 'DESC' }
    };

    if (page && limit) {
      queryOptions.skip = (page - 1) * limit;
      queryOptions.take = limit;
    }

    const eventos = await this.eventoRepository.find(queryOptions);

    // Si hay paginación, también devolver el total
    let total = null;
    if (page && limit) {
      total = await this.eventoRepository.count({ where: queryOptions.where });
    }

    const result = eventos.map(evento => ({
      id_evento: evento.id_evento,
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      fecha: evento.fecha?.toISOString(),
      ubicacion: evento.ubicacion,
      encargado: evento.encargado,
      creado_en: evento.creado_en,
      actualizado_en: evento.actualizado_en
    }));

    // Retornar con metadata de paginación si aplica
    if (total !== null) {
      return {
        data: result,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        }
      };
    }

    return result;
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

    const fechaNormalizada = parseFechaOrThrow(fecha, 'fecha');

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

    const fechaNormalizada = parseFechaOrThrow(fecha, 'fecha');

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