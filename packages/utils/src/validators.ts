/**
 * Validation utilities for business rules
 */

/**
 * Validate area value for construction spaces
 */
export class AreaValidator {
  private static readonly MIN_AREA = 0.01;
  private static readonly MAX_AREA = 10000;

  /**
   * Validate that area is within acceptable range
   */
  static isValid(area: number): boolean {
    return (
      typeof area === 'number' &&
      !isNaN(area) &&
      area >= this.MIN_AREA &&
      area <= this.MAX_AREA
    );
  }

  /**
   * Get validation error message
   */
  static getErrorMessage(area: number): string {
    if (typeof area !== 'number' || isNaN(area)) {
      return 'Area must be a valid number';
    }
    if (area < this.MIN_AREA) {
      return `Area must be at least ${this.MIN_AREA} m²`;
    }
    if (area > this.MAX_AREA) {
      return `Area must not exceed ${this.MAX_AREA} m²`;
    }
    return '';
  }
}

/**
 * Validate quantity values
 */
export class QuantityValidator {
  private static readonly MIN_QUANTITY = 1;
  private static readonly MAX_QUANTITY = 100;

  /**
   * Validate that quantity is within acceptable range
   */
  static isValid(quantity: number): boolean {
    return (
      typeof quantity === 'number' &&
      Number.isInteger(quantity) &&
      quantity >= this.MIN_QUANTITY &&
      quantity <= this.MAX_QUANTITY
    );
  }

  /**
   * Get validation error message
   */
  static getErrorMessage(quantity: number): string {
    if (typeof quantity !== 'number' || isNaN(quantity)) {
      return 'Quantity must be a valid number';
    }
    if (!Number.isInteger(quantity)) {
      return 'Quantity must be an integer';
    }
    if (quantity < this.MIN_QUANTITY) {
      return `Quantity must be at least ${this.MIN_QUANTITY}`;
    }
    if (quantity > this.MAX_QUANTITY) {
      return `Quantity must not exceed ${this.MAX_QUANTITY}`;
    }
    return '';
  }
}

/**
 * Validate string length
 */
export class StringLengthValidator {
  /**
   * Validate string length is within range
   */
  static isValid(str: string, min: number, max: number): boolean {
    const trimmed = str?.trim() || '';
    return trimmed.length >= min && trimmed.length <= max;
  }

  /**
   * Get validation error message
   */
  static getErrorMessage(
    fieldName: string,
    str: string,
    min: number,
    max: number,
  ): string {
    const trimmed = str?.trim() || '';
    if (trimmed.length < min) {
      return `${fieldName} must be at least ${min} characters`;
    }
    if (trimmed.length > max) {
      return `${fieldName} must not exceed ${max} characters`;
    }
    return '';
  }
}
