import { Global, Module } from "@nestjs/common";
import { AppLogger, TransactionManagerService } from "./services";
import { TransactionInterceptor } from "./interceptors";

@Global()
@Module({
  providers: [
    AppLogger,
    TransactionManagerService,
    TransactionInterceptor,
  ],
  exports: [
    AppLogger,
    TransactionManagerService,
    TransactionInterceptor,
  ],
})
export class SharedModule {}
