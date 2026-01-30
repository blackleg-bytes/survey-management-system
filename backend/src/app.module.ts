import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { ClsModule } from 'nestjs-cls';

// Config loaders
import { appConfig, databaseConfig, validateEnv } from '@config';

// Feature modules
// import { PropertyModule } from '@modules/property/property.module';
// import { ChatModule } from '@modules/chat/chat.module';
// import { UserModule } from '@modules/user/user.module';
// import { CacheModule } from '@modules/cache/cache.module';

// Global filters, interceptors, services, decorators
import {
  HttpExceptionFilter,
  AllExceptionsFilter,
  TypeORMExceptionFilter,
  TimeoutInterceptor,
  HttpLoggingInterceptor,
  TransformInterceptor,
  TransactionInterceptor,
  AppLogger,
  TransactionManagerService,
} from '@common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Core services

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validate: (value) => validateEnv(value),
    }),

    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.getOrThrow<TypeOrmModuleOptions>('database');

        const isDev = configService.get<boolean>('app.isDev');

        return {
          ...dbConfig,
          synchronize: isDev,
        };
      },
    }),

    // PropertyModule,
    // ChatModule,
    // UserModule,
    // CacheModule,
  ],

  providers: [
    AppLogger,
    AppService,
    TransactionManagerService,
    TransactionInterceptor,

    // ===== Global Filters =====
    { provide: APP_FILTER, useClass: TypeORMExceptionFilter }, // most specific
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_FILTER, useClass: AllExceptionsFilter }, // fallback

    // ===== Global Interceptors =====
    {
      provide: APP_INTERCEPTOR,
      useFactory: (configService: ConfigService) =>
        new TimeoutInterceptor(configService.get<number>('app.timeout', 30000)),
      inject: [ConfigService],
    },
    { provide: APP_INTERCEPTOR, useClass: HttpLoggingInterceptor },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },

    // ✅ Zod validation (replaces class-validator)
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],

  controllers: [AppController],
})
export class AppModule {}
