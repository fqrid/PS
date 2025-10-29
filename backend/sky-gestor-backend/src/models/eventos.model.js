import { EntitySchema } from 'typeorm';

export const Evento = new EntitySchema({
  name: 'Evento',
  tableName: 'eventos',
  columns: {
    id_evento: {
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
      nullable: true,
    },
    fecha: {
      type: 'datetime',
    },
    ubicacion: {
      type: 'varchar',
      length: 255,
    },
    encargado: {
      type: 'varchar',
      length: 255,
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
});