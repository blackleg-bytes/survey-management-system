import { Global, Module } from "@nestjs/common";
import {
  AppLogger,
  TransactionManagerService,
  RedisService,
  PasswordService,
} from "./services";
import { TransactionInterceptor } from "./interceptors";

@Global()
@Module({
  providers: [
    AppLogger,
    TransactionManagerService,
    TransactionInterceptor,
    RedisService,
    PasswordService,
  ],
  exports: [
    AppLogger,
    TransactionManagerService,
    TransactionInterceptor,
    RedisService,
    PasswordService,
  ],
})
export class SharedModule {}
