import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  port: Number(process.env.APP_PORT),
  nodeEnv: process.env.NODE_ENV,
  timeout: Number(process.env.APP_TIMEOUT),
  corsOrigins: process.env.APP_CORS_ORIGINS, // already transformed by Zod

  isDev: process.env.NODE_ENV === 'development',
  isProd: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
}));
