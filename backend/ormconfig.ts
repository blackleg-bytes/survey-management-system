import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * TypeORM CLI Configuration
 *
 * This file is used by TypeORM CLI for running migrations.
 *
 * Commands:
 * - Generate migration: npm run migration:generate -- src/migrations/MigrationName
 * - Create empty migration: npm run migration:create -- src/migrations/MigrationName
 * - Run migrations: npm run migration:run
 * - Revert last migration: npm run migration:revert
 * - Show migrations: npm run migration:show
 */

const options: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/migrations/*.ts'],
  migrationsTableName: 'migrations',
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
};

export default new DataSource(options);
