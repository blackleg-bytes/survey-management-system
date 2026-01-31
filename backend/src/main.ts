import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import { VersioningType } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import { Request } from "express";
import { CorsOptionsDelegate } from "@nestjs/common/interfaces/external/cors-options.interface";

import { AppModule } from "./app.module";
import { setupGracefulShutdown, AppLogger } from "@shared";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>("app.port", 3000);
  const nodeEnv = configService.get<string>("app.nodeEnv", "development");

  // ✅ Tell NestJS to use AppLogger
  const logger = app.get(AppLogger);
  app.useLogger(logger);

  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:", "https:"],
          scriptSrc: ["'self'"],
        },
      },
    }),
  );

  app.use(compression());

  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: "Too many requests from this IP",
      standardHeaders: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: "1",
    prefix: "api/v",
  });

  const corsOrigins = configService.get<string[]>("app.corsOrigins") ?? [
    "http://localhost:3001",
  ];

  const corsOptionsDelegate: CorsOptionsDelegate<Request> = (
    req,
    callback,
  ): void => {
    const origin = req.header("Origin");
    const isAllowed = !origin || corsOrigins.includes(origin);

    if (!isAllowed) {
      logger.warn(`Blocked CORS origin: ${origin}`);
    }

    callback(null, {
      origin: isAllowed,
      credentials: true,
    });
  };

  app.enableCors(corsOptionsDelegate);

  if (nodeEnv === "development") {
    const swaggerConfig = new DocumentBuilder()
      .setTitle("Real Estate Chatbot API")
      .setVersion("1.0")
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup("api/docs", app, document);
    logger.log(`📚 Swagger: http://localhost:${port}/api/docs`);
  }

  setupGracefulShutdown(app, logger);

  await app.listen(port, "0.0.0.0");
  logger.log(`🚀 Server running on http://localhost:${port}/api/v1`);
}

void bootstrap();
