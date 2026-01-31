import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Observable, from } from "rxjs";
import { TransactionManagerService } from "@shared/services";

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(private readonly txManager: TransactionManagerService) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    return from(
      this.txManager.runInTransaction(() => next.handle().toPromise()),
    );
  }
}
