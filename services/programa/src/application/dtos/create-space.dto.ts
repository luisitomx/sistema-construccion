import {
  IsString,
  IsNotEmpty,
  IsUUID,
  IsNumber,
  IsPositive,
  Min,
  Max,
  MinLength,
  MaxLength,
  IsOptional,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/**
 * DTO for creating a new space
 */
export class CreateSpaceDto {
  @ApiProperty({
    description: 'Project ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @ApiProperty({
    description: 'Space name',
    example: 'Cocina',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Space code (alphanumeric)',
    example: 'COC-01',
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  code?: string;

  @ApiProperty({
    description: 'Space Type ID (UUID)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  @IsNotEmpty()
  spaceTypeId: string;

  @ApiProperty({
    description: 'Required area in m² from architectural program',
    example: 12.5,
    minimum: 0.01,
    maximum: 10000,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(10000)
  requiredArea: number;

  @ApiPropertyOptional({
    description: 'Space description',
    example: 'Cocina integral con isla central',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Floor/Level number',
    example: 1,
  })
  @IsInt()
  @IsOptional()
  floor?: number;

  @ApiProperty({
    description: 'Quantity of spaces of this type',
    example: 1,
    minimum: 1,
    maximum: 100,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @Max(100)
  @IsOptional()
  quantity?: number;
}
