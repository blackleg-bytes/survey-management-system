/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { AppLogger } from '@common/services';
import { StreamableFile } from '@nestjs/common';
import { Readable } from 'stream';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    // Only log HTTP requests
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const res = httpContext.getResponse<Response>();

    const start = Date.now();

    return next.handle().pipe(
      tap((responseBody: unknown) => {
        const duration = Date.now() - start;

        // ✅ Main request log (always)
        this.logger.logRequest(req.method, req.originalUrl, res.statusCode, duration);

        // ✅ Debug-level details (AppLogger already hides in prod)
        const isStream =
          responseBody instanceof StreamableFile ||
          responseBody instanceof Readable ||
          Buffer.isBuffer(responseBody);

        this.logger.debug(
          {
            ip: req.ip,
            headers: req.headers,
            body: req.body,
            query: req.query,
            params: req.params,
            response: isStream ? '[stream/file response omitted]' : responseBody,
          },
          'HTTP_DETAILS',
        );
      }),
    );
  }
}
