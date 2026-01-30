/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const isDev = this.configService.get<boolean>('app.isDev');

    const message =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : ((exceptionResponse as any)?.message ?? 'Request failed');

    const errorPayload: Record<string, unknown> = {
      success: false,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    // ✅ DEV / TEST → expose details
    if (isDev) {
      errorPayload.stack = exception.stack;
      errorPayload.error = exceptionResponse;
    }

    response.status(status).json(errorPayload);
  }
}
