import { AreaValidator } from '@construccion/utils';

/**
 * Area Value Object
 * Representa un área en metros cuadrados con validaciones de negocio
 */
export class Area {
  private readonly _value: number;

  constructor(value: number) {
    if (!AreaValidator.isValid(value)) {
      throw new Error(AreaValidator.getErrorMessage(value));
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }

  /**
   * Compare if this area is greater than another
   */
  isGreaterThan(other: Area): boolean {
    return this._value > other.value;
  }

  /**
   * Compare if this area is less than another
   */
  isLessThan(other: Area): boolean {
    return this._value < other.value;
  }

  /**
   * Compare if this area equals another
   */
  equals(other: Area): boolean {
    return this._value === other.value;
  }

  /**
   * Calculate percentage difference with another area
   */
  percentageDifference(other: Area): number {
    if (other.value === 0) return 0;
    return ((this._value - other.value) / other.value) * 100;
  }

  /**
   * Create Area from numeric value
   */
  static create(value: number): Area {
    return new Area(value);
  }

  toString(): string {
    return `${this._value} m²`;
  }
}
