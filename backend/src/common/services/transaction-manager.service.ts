import { Global, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ClsService } from 'nestjs-cls';
import { TRANSACTION_MANAGER_KEY } from '@common/constants';

@Global()
@Injectable()
export class TransactionManagerService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly cls: ClsService,
  ) {}

  async runInTransaction<T>(fn: () => Promise<T>): Promise<T> {
    // Reuse existing transaction if present
    if (this.cls.has(TRANSACTION_MANAGER_KEY)) {
      return fn();
    }

    // Otherwise start a new one
    return this.dataSource.transaction(async (manager) => {
      this.cls.set(TRANSACTION_MANAGER_KEY, manager);
      return fn();
    });
  }

  getManager(): EntityManager {
    return this.cls.get<EntityManager>(TRANSACTION_MANAGER_KEY) ?? this.dataSource.manager;
  }
}
