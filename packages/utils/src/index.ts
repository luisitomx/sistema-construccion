/**
 * Shared Utilities for Sistema Integral de Gestión de Construcción
 */

import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

/**
 * UUID Utilities
 */
export class UuidHelper {
  /**
   * Generate a new UUID v4
   */
  static generate(): string {
    return uuidv4();
  }

  /**
   * Validate if a string is a valid UUID
   */
  static isValid(uuid: string): boolean {
    return uuidValidate(uuid);
  }
}

/**
 * Date Utilities
 */
export class DateHelper {
  /**
   * Check if a date is in the past
   */
  static isPast(date: Date): boolean {
    return date < new Date();
  }

  /**
   * Check if date1 is before date2
   */
  static isBefore(date1: Date, date2: Date): boolean {
    return date1 < date2;
  }

  /**
   * Check if date1 is after date2
   */
  static isAfter(date1: Date, date2: Date): boolean {
    return date1 > date2;
  }

  /**
   * Format date to ISO string
   */
  static toISOString(date: Date): string {
    return date.toISOString();
  }

  /**
   * Parse ISO string to Date
   */
  static fromISOString(iso: string): Date {
    return new Date(iso);
  }
}

/**
 * Number Utilities
 */
export class NumberHelper {
  /**
   * Check if a number is positive
   */
  static isPositive(num: number): boolean {
    return num > 0;
  }

  /**
   * Check if a number is within a range (inclusive)
   */
  static isInRange(num: number, min: number, max: number): boolean {
    return num >= min && num <= max;
  }

  /**
   * Round to specified decimal places
   */
  static round(num: number, decimals: number = 2): number {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
}

/**
 * String Utilities
 */
export class StringHelper {
  /**
   * Check if string is empty or whitespace
   */
  static isEmpty(str: string): boolean {
    return !str || str.trim().length === 0;
  }

  /**
   * Capitalize first letter
   */
  static capitalize(str: string): string {
    if (StringHelper.isEmpty(str)) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }

  /**
   * Truncate string to max length
   */
  static truncate(str: string, maxLength: number): string {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength - 3) + '...';
  }
}

/**
 * Error handling utilities
 */
export class ErrorHelper {
  /**
   * Create a standardized error response
   */
  static createErrorResponse(
    code: string,
    message: string,
    details?: any,
  ): { code: string; message: string; details?: any } {
    return {
      code,
      message,
      ...(details && { details }),
    };
  }

  /**
   * Check if error is of specific type
   */
  static isInstanceOf<T extends Error>(
    error: unknown,
    errorClass: new (...args: any[]) => T,
  ): error is T {
    return error instanceof errorClass;
  }
}

// Export all utilities
export * from './validators';
