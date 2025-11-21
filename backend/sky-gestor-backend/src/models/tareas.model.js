import { EntitySchema } from 'typeorm';
import { Usuario } from './usuarios.model.js';
import { Evento } from './eventos.model.js';

export const Tarea = new EntitySchema({
  name: 'Tarea',
  tableName: 'tareas',
  columns: {
    id_tarea: {
      primary: true,
      type: 'int',
      generated: true,
    },
    titulo: {
      type: 'varchar',
      length: 255,
    },
    descripcion: {
      type: 'text',
    },
    estado: {
      type: 'enum',
      enum: ['pendiente', 'en_progreso', 'completada'],
      default: 'pendiente',
    },
    fecha: {
      type: 'datetime',
    },
    id_usuario_asignado: {
      type: 'int',
      nullable: true,
    },
    id_evento_asociado: {
      type: 'int',
      nullable: true,
    },
    creado_en: {
      type: 'timestamp',
      createDate: true,
    },
    actualizado_en: {
      type: 'timestamp',
      updateDate: true,
    },
  },
  relations: {
    usuario_asignado: {
      type: 'many-to-one',
      target: 'Usuario',
      joinColumn: { name: 'id_usuario_asignado' },
      nullable: true,
    },
    evento_asociado: {
      type: 'many-to-one',
      target: 'Evento',
      joinColumn: { name: 'id_evento_asociado' },
      nullable: true,
    },
  },
});