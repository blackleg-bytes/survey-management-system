import { Injectable, ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppLogger extends ConsoleLogger {
  private readonly isProd: boolean;

  constructor(configService: ConfigService) {
    super();
    this.isProd = configService.get<boolean>('app.isProd', false);
  }

  log(message: unknown, context?: string): void {
    super.log(this.format(message), context);
  }

  error(message: unknown, stack?: string, context?: string): void {
    super.error(this.format(message), stack, context);
  }

  warn(message: unknown, context?: string): void {
    super.warn(this.format(message), context);
  }

  debug(message: unknown, context?: string): void {
    if (!this.isProd) {
      super.debug(this.format(message), context);
    }
  }

  verbose(message: unknown, context?: string): void {
    if (!this.isProd) {
      super.verbose(this.format(message), context);
    }
  }

  logRequest(method: string, url: string, statusCode: number, duration: number): void {
    const emoji = statusCode < 400 ? '✅' : '❌';
    this.log(`${emoji} ${method} ${url} ${statusCode} (${duration}ms)`, 'HTTP');
  }

  logQuery(query: string, duration: number): void {
    if (duration > 1000) {
      this.warn(`Slow query (${duration}ms): ${query}`, 'DATABASE');
    } else {
      this.debug(`Query (${duration}ms): ${query}`, 'DATABASE');
    }
  }

  private format(message: unknown): string {
    if (message === undefined) {
      return '';
    }

    if (message === null) {
      return 'null';
    }

    if (typeof message === 'string') {
      return message;
    }

    if (typeof message === 'number' || typeof message === 'boolean') {
      return message.toString();
    }

    if (message instanceof Error) {
      return message.message;
    }

    try {
      return JSON.stringify(message);
    } catch {
      return '[Unserializable object]';
    }
  }
}
