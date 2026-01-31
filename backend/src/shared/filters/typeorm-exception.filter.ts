/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from "@nestjs/common";
import { QueryFailedError } from "typeorm";
import { Request, Response } from "express";
import { ConfigService } from "@nestjs/config";

@Catch(QueryFailedError)
export class TypeORMExceptionFilter implements ExceptionFilter {
  constructor(private readonly configService: ConfigService) {}

  catch(exception: QueryFailedError, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isDev = this.configService.get<boolean>("app.isDev");
    const error = exception as any;

    let status = HttpStatus.BAD_REQUEST;
    let message = "Database error";

    if (error?.code === "23505") {
      status = HttpStatus.CONFLICT;
      message = "Duplicate resource";
    }

    const payload = {
      success: false,
      message,
      statusCode: status,
      data: null,
      errors: null,
      path: request.url,
      timestamp: new Date().toISOString(),
      detail: undefined as string | undefined, // Explicit keys for dev
      code: undefined as string | undefined,
      stack: undefined as string | undefined,
    };

    // ✅ DEV → include DB details
    if (isDev) {
      payload.detail = error?.detail;
      payload.code = error?.code;
      payload.stack = exception.stack;
    }

    response.status(status).json(payload);
  }
}
