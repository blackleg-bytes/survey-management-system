import { applyDecorators, UseInterceptors } from "@nestjs/common";
import { TransactionInterceptor } from "@shared/interceptors";

export function Transactional(): MethodDecorator & ClassDecorator {
  return applyDecorators(UseInterceptors(TransactionInterceptor));
}
