import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  autoLoadEntities: true,

  // Migrations configuration
  migrations: ['dist/migrations/*.js'],
  migrationsTableName: 'migrations',
  migrationsRun: process.env.NODE_ENV === 'production', // Auto-run in production

  // ⛔ DO NOT decide synchronize here - handled in app.module.ts
  synchronize: false,

  // Connection pool settings
  extra: {
    max: 10, // Maximum number of connections in the pool
    idleTimeoutMillis: 30000,
  },

  // Logging (only in development)
  logging: process.env.NODE_ENV === 'development',
}));
