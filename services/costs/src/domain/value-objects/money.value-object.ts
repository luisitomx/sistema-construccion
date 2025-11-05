import Decimal from 'decimal.js';

export class Money {
  private readonly amount: Decimal;
  private readonly currency: string;

  constructor(amount: number | string, currency: string = 'MXN') {
    this.amount = new Decimal(amount);
    this.currency = currency;
  }

  getValue(): number {
    return this.amount.toNumber();
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount.plus(other.amount).toNumber(), this.currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.amount.minus(other.amount).toNumber(), this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount.times(factor).toNumber(), this.currency);
  }

  divide(divisor: number): Money {
    if (divisor === 0) {
      throw new Error('Cannot divide by zero');
    }
    return new Money(this.amount.dividedBy(divisor).toNumber(), this.currency);
  }

  round(decimalPlaces: number = 2): Money {
    return new Money(
      this.amount.toDecimalPlaces(decimalPlaces).toNumber(),
      this.currency
    );
  }

  equals(other: Money): boolean {
    return (
      this.currency === other.currency &&
      this.amount.equals(other.amount)
    );
  }

  isGreaterThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount.greaterThan(other.amount);
  }

  isLessThan(other: Money): boolean {
    this.assertSameCurrency(other);
    return this.amount.lessThan(other.amount);
  }

  private assertSameCurrency(other: Money): void {
    if (this.currency !== other.currency) {
      throw new Error('Cannot operate on different currencies');
    }
  }

  toString(): string {
    const fixed = this.amount.toFixed(2);
    return `${this.currency} ${fixed}`;
  }

  static zero(currency: string = 'MXN'): Money {
    return new Money(0, currency);
  }
}
