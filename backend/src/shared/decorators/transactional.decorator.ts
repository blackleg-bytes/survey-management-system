import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { TransactionInterceptor } from "@shared/interceptors";

export function Transactional() {
  return applyDecorators(UseInterceptors(TransactionInterceptor));
}
