import { InvalidValueObjectException } from "../exceptions/invalid-value-object.exception";
import { ValueObject } from "../interfaces/value-object.interface";

export class Email implements ValueObject<string> {
  private readonly _value: string;

  constructor(value: string) {
    this.validate(value);
    this._value = value.toLowerCase(); // Store email in lowercase
  }

  get value(): string {
    return this._value;
  }

  private validate(value: string): void {
    if (!value || !this.isValidEmail(value)) {
      throw new InvalidValueObjectException('messages.error.invalid_email');
    }
  }

  // Basic email validation regex (you can use a more sophisticated regex)
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
