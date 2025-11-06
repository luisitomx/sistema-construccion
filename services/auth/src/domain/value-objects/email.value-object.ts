/**
 * Email Value Object
 * Validates email format
 */
export class Email {
  private readonly _value: string;
  private static readonly EMAIL_REGEX =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  constructor(value: string) {
    const normalized = value.trim().toLowerCase();

    if (!Email.isValid(normalized)) {
      throw new Error('Invalid email format');
    }

    this._value = normalized;
  }

  get value(): string {
    return this._value;
  }

  /**
   * Validate email format
   */
  static isValid(email: string): boolean {
    return this.EMAIL_REGEX.test(email);
  }

  /**
   * Get email domain
   */
  getDomain(): string {
    return this._value.split('@')[1];
  }

  /**
   * Get email username
   */
  getUsername(): string {
    return this._value.split('@')[0];
  }

  /**
   * Compare with another email
   */
  equals(other: Email): boolean {
    return this._value === other.value;
  }

  /**
   * Create Email from string
   */
  static create(value: string): Email {
    return new Email(value);
  }

  toString(): string {
    return this._value;
  }
}
