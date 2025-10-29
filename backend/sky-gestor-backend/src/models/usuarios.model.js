import { EntitySchema } from 'typeorm';

export const Usuario = new EntitySchema({
  name: 'Usuario',
  tableName: 'usuarios',
  columns: {
    id_usuario: {
      primary: true,
      type: 'int',
      generated: true,
    },
    nombre: {
      type: 'varchar',
      length: 255,
    },
    correo: {
      type: 'varchar',
      length: 255,
      unique: true,
    },
    contrasena: {
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