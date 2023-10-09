import { InvalidValueObjectException } from "../exceptions/invalid-value-object.exception";

export class ValueObject {
    private readonly _value: string;
  
    constructor(value: string) {
      this.validate(value);
      this._value = value;
    }
  
    get value(): string {
      return this._value;
    }
  
    private validate(value: string): void {
      if (!value) {
        throw new InvalidValueObjectException('messages.error.value_cannot_be_empty');
      }
    }
  }
  