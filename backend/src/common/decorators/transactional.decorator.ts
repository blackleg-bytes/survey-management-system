import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { TransactionInterceptor } from '@common/interceptors';

export function Transactional() {
  return applyDecorators(UseInterceptors(TransactionInterceptor));
}
