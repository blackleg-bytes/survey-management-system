import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable, map } from "rxjs";
import { RESPONSE_MESSAGE_KEY } from "@shared/decorators";
import { Response } from "express";
import { ApiResponse } from "@shared/interfaces";

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T>
> {
  constructor(private readonly reflector: Reflector) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T>> {
    const httpCtx = context.switchToHttp();
    const response = httpCtx.getResponse<Response>();

    const handlerMessage =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ??
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getClass());

    const message = handlerMessage ?? "Request successful";

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message,
        statusCode: response.statusCode,
        data: data ?? null,
        errors: null,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
