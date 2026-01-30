import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from '@common/services';
import { ConfigService } from '@nestjs/config';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: AppLogger,
    private readonly configService: ConfigService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isDev = this.configService.get<boolean>('app.isDev');

    this.logger.error(
      {
        exception,
        method: request.method,
        path: request.url,
      },
      'UNHANDLED_EXCEPTION',
    );

    const errorPayload: Record<string, unknown> = {
      success: false,
      message: 'Internal server error',
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    // ✅ DEV / TEST → expose stack
    if (isDev && exception instanceof Error) {
      errorPayload.stack = exception.stack;
      errorPayload.name = exception.name;
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorPayload);
  }
}
