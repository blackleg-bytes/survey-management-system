import { INestApplication } from "@nestjs/common";
import { AppLogger } from "@shared/services";
import { DataSource } from "typeorm";

export function setupGracefulShutdown(
  app: INestApplication,
  logger: AppLogger,
): void {
  let isShuttingDown = false;

  const shutdown = async (signal: string) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    logger.warn(
      `Received ${signal}, starting graceful shutdown...`,
      "SHUTDOWN",
    );

    // ⏱ Force-exit timeout (starts when shutdown begins)
    const shutdownTimeout = setTimeout(() => {
      logger.error(
        "Graceful shutdown timeout exceeded — forcing exit",
        undefined,
        "SHUTDOWN",
      );
      process.exit(1);
    }, 30_000);

    try {
      // 🗃️ Close database
      try {
        const dataSource = app.get(DataSource, { strict: false });
        if (dataSource?.isInitialized) {
          await dataSource.destroy();
          logger.log("Database connections closed", "SHUTDOWN");
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          logger.error(err.message, err.stack, "SHUTDOWN");
        } else {
          logger.error(
            "Unknown error closing database connections",
            undefined,
            "SHUTDOWN",
          );
        }
      }

      // 🛑 Close NestJS app LAST
      await app.close();
      logger.log("Nest application closed", "SHUTDOWN");

      clearTimeout(shutdownTimeout);
      logger.log("Graceful shutdown complete ✅", "SHUTDOWN");
      process.exit(0);
    } catch (err: unknown) {
      if (err instanceof Error) {
        logger.error(err.message, err.stack, "SHUTDOWN");
      } else {
        logger.error("Fatal error during shutdown", undefined, "SHUTDOWN");
      }
      process.exit(1);
    }
  };

  // 🧠 OS signals
  process.on("SIGTERM", () => void shutdown("SIGTERM"));
  process.on("SIGINT", () => void shutdown("SIGINT"));

  // 💥 Uncaught exceptions
  process.on("uncaughtException", (error: Error) => {
    logger.error(error.message, error.stack, "PROCESS");
    void shutdown("uncaughtException");
  });

  // 💥 Unhandled promise rejections
  process.on("unhandledRejection", (reason: unknown) => {
    if (reason instanceof Error) {
      logger.error(reason.message, reason.stack, "PROCESS");
    } else {
      logger.error(
        `Unhandled Rejection: ${JSON.stringify(reason)}`,
        undefined,
        "PROCESS",
      );
    }
    void shutdown("unhandledRejection");
  });
}
