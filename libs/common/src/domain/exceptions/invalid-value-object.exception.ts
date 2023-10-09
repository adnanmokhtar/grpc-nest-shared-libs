import { DomainException } from './domain.exception';

export class InvalidValueObjectException extends DomainException {
  constructor(message: string) {
    super(message);
  }
}
