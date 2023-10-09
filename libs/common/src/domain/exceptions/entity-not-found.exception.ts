import { DomainException } from './domain.exception';

export class EntityNotFoundException extends DomainException {
  constructor(entityName: string) {
    super(`messages.error.not_found-entityName-${entityName}`);
  }
}
