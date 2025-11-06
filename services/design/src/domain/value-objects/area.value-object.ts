export class Area {
  private readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error('Area cannot be negative');
    }
    this.value = value;
  }

  getValue(): number {
    return this.value;
  }

  toSquareMeters(): number {
    return this.value;
  }

  toSquareFeet(): number {
    return this.value * 10.7639;
  }

  equals(other: Area): boolean {
    return this.value === other.value;
  }

  static fromSquareMeters(value: number): Area {
    return new Area(value);
  }

  static fromSquareFeet(value: number): Area {
    return new Area(value / 10.7639);
  }
}
