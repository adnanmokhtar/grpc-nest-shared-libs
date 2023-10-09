// dto-transformer.ts
import { plainToClass } from 'class-transformer';

export function transformToDto<T>(DtoClass: new () => T, message: any): T {
  return plainToClass(DtoClass, message);
}