import { InvalidValueObjectException } from "../exceptions/invalid-value-object.exception";
import { ValueObject } from "../interfaces/value-object.interface";

export class Name implements ValueObject<string> {
    private readonly _value: string;
  
    constructor(value: string) {
      this.validate(value);
      this._value = value;
    }
  
    get value(): string {
      return this._value;
    }
  
    private validate(value: string): void {
      if (!value || value.length < 2 || value.length > 255) {
        throw new InvalidValueObjectException('messages.error.invalid_name');
      }
    }
  }