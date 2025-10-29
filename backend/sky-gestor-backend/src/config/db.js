import { DataSource } from 'typeorm';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import 'dotenv/config';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'mi_proyecto',
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  entities: [join(__dirname, '../models/*.model.js')], // 🌟 apuntando a *.model.js
  migrations: [join(__dirname, '../migrations/*.js')],
  charset: 'utf8mb4',
  timezone: 'Z',
  extra: {
    connectionLimit: 10,
    waitForConnections: true,
    queueLimit: 0
  }
});

// Función para probar la conexión
export const testConnection = async () => {
  try {
    await AppDataSource.initialize();
    console.log('✅ Conexión a la base de datos MySQL con TypeORM exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos MySQL:', error);
    return false;
  }
};