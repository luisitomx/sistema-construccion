import { IsArray, IsNumber, IsUUID, IsDateString, IsOptional, ValidateNested, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class MaterialComponentDto {
  @IsUUID()
  materialId: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  @Max(1)
  wasteFactor: number;
}

export class LaborComponentDto {
  @IsUUID()
  laborId: string;

  @IsNumber()
  @Min(0)
  hours: number;

  @IsNumber()
  @Min(0)
  performance: number;
}

export class EquipmentComponentDto {
  @IsUUID()
  equipmentId: string;

  @IsNumber()
  @Min(0)
  hours: number;
}

export class CreateUnitPriceAnalysisDto {
  @IsUUID()
  conceptId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MaterialComponentDto)
  materials: MaterialComponentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LaborComponentDto)
  labor: LaborComponentDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EquipmentComponentDto)
  equipment: EquipmentComponentDto[];

  @IsNumber()
  @Min(0)
  @Max(100)
  indirectCostFactor: number;

  @IsNumber()
  @Min(0)
  @Max(100)
  profitFactor: number;

  @IsDateString()
  validFrom: string;

  @IsDateString()
  @IsOptional()
  validUntil?: string;
}
