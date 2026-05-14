import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';



export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',

  host: process.env.DB_HOST,

  port: Number(process.env.DB_PORT),

  username: process.env.DB_USERNAME,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_DATABASE,

  entities: ['src/**/*.entity.ts'],

  migrations: ['src/db/migrations/*.ts'],

  synchronize: false,

  logging: process.env.NODE_ENV !== 'production',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;