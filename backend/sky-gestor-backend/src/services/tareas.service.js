// src/services/tareasService.js
import { AppDataSource } from '../config/db.js';
import { Tarea } from '../models/tareas.model.js';
import { Usuario } from '../models/usuarios.model.js';
import { Evento } from '../models/eventos.model.js';
import { AppError } from '../utils/AppError.js';
import { parseFechaOrThrow } from '../utils/dateUtils.js';

class TareasService {
  constructor() {
    this.tareaRepository = AppDataSource.getRepository(Tarea);
    this.usuarioRepository = AppDataSource.getRepository(Usuario);
    this.eventoRepository = AppDataSource.getRepository(Evento);
  }

  async obtenerTodas(filters = {}) {
    const { estado, usuarioId, page, limit } = filters;

    // Construir condiciones de filtrado
    const where = {};

    if (estado) {
      // Validar que el estado sea válido
      const estadosValidos = ['pendiente', 'en_progreso', 'completada'];
      if (!estadosValidos.includes(estado)) {
        throw new AppError(`Estado inválido. Debe ser uno de: ${estadosValidos.join(', ')}`, 400);
      }
      where.estado = estado;
    }

    if (usuarioId) {
      where.id_usuario_asignado = parseInt(usuarioId);
    }

    // Paginación
    const queryOptions = {
      where: Object.keys(where).length > 0 ? where : undefined,
      relations: ['usuario_asignado', 'evento_asociado'],
      order: { fecha: 'ASC' }
    };

    if (page && limit) {
      queryOptions.skip = (page - 1) * limit;
      queryOptions.take = limit;
    }

    const tareas = await this.tareaRepository.find(queryOptions);

    // Si hay paginación, también devolver el total
    let total = null;
    if (page && limit) {
      total = await this.tareaRepository.count({ where: queryOptions.where });
    }

    const result = tareas.map(tarea => ({
      id_tarea: tarea.id_tarea,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: tarea.estado,
      fecha: tarea.fecha,
      id_usuario_asignado: tarea.id_usuario_asignado,
      id_evento_asociado: tarea.id_evento_asociado,
      usuario_asignado_nombre: tarea.usuario_asignado ? tarea.usuario_asignado.nombre : null,
      evento_asociado_titulo: tarea.evento_asociado ? tarea.evento_asociado.titulo : null,
      creado_en: tarea.creado_en,
      actualizado_en: tarea.actualizado_en
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

  async obtenerPorId(id_tarea) {
    const tarea = await this.tareaRepository.findOne({
      where: { id_tarea },
      relations: ['usuario_asignado', 'evento_asociado']
    });

    if (!tarea) {
      throw new AppError('Tarea no encontrada', 404);
    }

    return {
      id_tarea: tarea.id_tarea,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: tarea.estado,
      fecha: tarea.fecha,
      id_usuario_asignado: tarea.id_usuario_asignado,
      id_evento_asociado: tarea.id_evento_asociado,
      usuario_asignado_nombre: tarea.usuario_asignado ? tarea.usuario_asignado.nombre : null,
      evento_asociado_titulo: tarea.evento_asociado ? tarea.evento_asociado.titulo : null,
      creado_en: tarea.creado_en,
      actualizado_en: tarea.actualizado_en
    };
  }

  async crear(data) {
    const { titulo, descripcion, estado = 'pendiente', fecha, id_usuario_asignado, id_evento_asociado } = data;

    // Validación de campos obligatorios
    if (!titulo || !descripcion || !fecha) {
      throw new AppError('Título, descripción y fecha son campos obligatorios', 400);
    }

    // Convertir '' a null
    const finalUsuarioAsignadoId = id_usuario_asignado === '' ? null : id_usuario_asignado;
    const finalEventoAsociadoId = id_evento_asociado === '' ? null : id_evento_asociado;

    // Validar usuario si se proporciona
    if (finalUsuarioAsignadoId) {
      const usuario = await this.usuarioRepository.findOne({
        where: { id_usuario: finalUsuarioAsignadoId }
      });
      if (!usuario) {
        throw new AppError('Usuario no válido', 400);
      }
    }

    // Validar evento si se proporciona
    if (finalEventoAsociadoId) {
      const evento = await this.eventoRepository.findOne({
        where: { id_evento: finalEventoAsociadoId }
      });
      if (!evento) {
        throw new AppError('Evento no válido', 400);
      }
    }

    // Validar fecha
    const fechaNormalizada = parseFechaOrThrow(fecha, 'fecha');

    const tarea = this.tareaRepository.create({
      titulo,
      descripcion,
      estado,
      fecha: fechaNormalizada,
      id_usuario_asignado: finalUsuarioAsignadoId,
      id_evento_asociado: finalEventoAsociadoId
    });

    await this.tareaRepository.save(tarea);

    // Obtener la tarea con relaciones para devolver los nombres
    const tareaCreada = await this.tareaRepository.findOne({
      where: { id_tarea: tarea.id_tarea },
      relations: ['usuario_asignado', 'evento_asociado']
    });

    return {
      id_tarea: tareaCreada.id_tarea,
      titulo: tareaCreada.titulo,
      descripcion: tareaCreada.descripcion,
      estado: tareaCreada.estado,
      fecha: tareaCreada.fecha,
      id_usuario_asignado: tareaCreada.id_usuario_asignado,
      id_evento_asociado: tareaCreada.id_evento_asociado,
      usuario_asignado_nombre: tareaCreada.usuario_asignado ? tareaCreada.usuario_asignado.nombre : null,
      evento_asociado_titulo: tareaCreada.evento_asociado ? tareaCreada.evento_asociado.titulo : null,
      creado_en: tareaCreada.creado_en
    };
  }

  async actualizar(id_tarea, data) {
    const { titulo, descripcion, estado, fecha, id_usuario_asignado, id_evento_asociado } = data;

    // Verificar que la tarea existe
    const tareaExistente = await this.tareaRepository.findOne({
      where: { id_tarea }
    });
    if (!tareaExistente) {
      throw new AppError('Tarea no encontrada para actualizar', 404);
    }

    // Convertir '' a null
    const finalUsuarioAsignadoId = (id_usuario_asignado === '' || id_usuario_asignado === undefined) ? null : id_usuario_asignado;
    const finalEventoAsociadoId = (id_evento_asociado === '' || id_evento_asociado === undefined) ? null : id_evento_asociado;

    // Validar usuario si se proporciona
    if (finalUsuarioAsignadoId) {
      const usuario = await this.usuarioRepository.findOne({
        where: { id_usuario: finalUsuarioAsignadoId }
      });
      if (!usuario) {
        throw new AppError('Usuario no válido', 400);
      }
    }

    // Validar evento si se proporciona
    if (finalEventoAsociadoId) {
      const evento = await this.eventoRepository.findOne({
        where: { id_evento: finalEventoAsociadoId }
      });
      if (!evento) {
        throw new AppError('Evento no válido', 400);
      }
    }

    // Validar fecha
    const fechaNormalizada = parseFechaOrThrow(fecha, 'fecha');

    tareaExistente.titulo = titulo;
    tareaExistente.descripcion = descripcion;
    tareaExistente.estado = estado;
    tareaExistente.fecha = fechaNormalizada;
    tareaExistente.id_usuario_asignado = finalUsuarioAsignadoId;
    tareaExistente.id_evento_asociado = finalEventoAsociadoId;

    await this.tareaRepository.save(tareaExistente);

    // Obtener la tarea actualizada con relaciones
    const tareaActualizada = await this.tareaRepository.findOne({
      where: { id_tarea },
      relations: ['usuario_asignado', 'evento_asociado']
    });

    return {
      id_tarea: tareaActualizada.id_tarea,
      titulo: tareaActualizada.titulo,
      descripcion: tareaActualizada.descripcion,
      estado: tareaActualizada.estado,
      fecha: tareaActualizada.fecha,
      id_usuario_asignado: tareaActualizada.id_usuario_asignado,
      id_evento_asociado: tareaActualizada.id_evento_asociado,
      usuario_asignado_nombre: tareaActualizada.usuario_asignado ? tareaActualizada.usuario_asignado.nombre : null,
      evento_asociado_titulo: tareaActualizada.evento_asociado ? tareaActualizada.evento_asociado.titulo : null,
      actualizado_en: tareaActualizada.actualizado_en
    };
  }

  async eliminar(id_tarea) {
    const tarea = await this.tareaRepository.findOne({
      where: { id_tarea }
    });

    if (!tarea) {
      throw new AppError('Tarea no encontrada para eliminar', 404);
    }

    await this.tareaRepository.remove(tarea);
    return { message: 'Tarea eliminada con éxito' };
  }

  async obtenerDatosSelectores() {
    const usuarios = await this.usuarioRepository.find({
      select: ['id_usuario', 'nombre', 'correo']
    });

    const eventos = await this.eventoRepository.find({
      select: ['id_evento', 'titulo', 'fecha']
    });

    return {
      usuarios: usuarios.map(u => ({ id: u.id_usuario, nombre: u.nombre })),
      eventos: eventos.map(e => ({ id: e.id_evento, titulo: e.titulo }))
    };
  }

  async obtenerPorEvento(eventoId) {
    const tareas = await this.tareaRepository.find({
      where: { id_evento_asociado: eventoId },
      relations: ['usuario_asignado', 'evento_asociado'],
      order: { fecha: 'ASC' }
    });

    return tareas.map(tarea => ({
      id_tarea: tarea.id_tarea,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: tarea.estado,
      fecha: tarea.fecha,
      id_usuario_asignado: tarea.id_usuario_asignado,
      id_evento_asociado: tarea.id_evento_asociado,
      usuario_asignado_nombre: tarea.usuario_asignado ? tarea.usuario_asignado.nombre : null,
      evento_asociado_titulo: tarea.evento_asociado ? tarea.evento_asociado.titulo : null
    }));
  }

  async obtenerPorUsuario(usuarioId) {
    const tareas = await this.tareaRepository.find({
      where: { id_usuario_asignado: usuarioId },
      relations: ['usuario_asignado', 'evento_asociado'],
      order: { fecha: 'ASC' }
    });

    return tareas.map(tarea => ({
      id_tarea: tarea.id_tarea,
      titulo: tarea.titulo,
      descripcion: tarea.descripcion,
      estado: tarea.estado,
      fecha: tarea.fecha,
      id_usuario_asignado: tarea.id_usuario_asignado,
      id_evento_asociado: tarea.id_evento_asociado,
      usuario_asignado_nombre: tarea.usuario_asignado ? tarea.usuario_asignado.nombre : null,
      evento_asociado_titulo: tarea.evento_asociado ? tarea.evento_asociado.titulo : null
    }));
  }
}

export default new TareasService();