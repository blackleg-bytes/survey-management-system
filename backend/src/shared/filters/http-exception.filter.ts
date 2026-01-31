/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from "@nestjs/common";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const isDev = this.configService.get<boolean>("app.isDev");

    const message =
      typeof exceptionResponse === "string"
        ? exceptionResponse
        : ((exceptionResponse as any)?.message ?? "Request failed");

    const errorPayload = {
      success: false,
      message,
      statusCode: status,
      data: null,
      timestamp: new Date().toISOString(),
      path: request.url, // Default path here
      stack: undefined as string | undefined,
      errors: null as string | object | null,
    };

    // ✅ DEV / TEST → expose details
    if (isDev) {
      // errorPayload.path = request.url; // Already set
      errorPayload.stack = exception.stack;
      errorPayload.errors = exceptionResponse;
    }

    response.status(status).json(errorPayload);
  }
}
