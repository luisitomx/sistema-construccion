import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsDateString,
  IsEnum,
  ValidateIf,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { ProjectStatus } from '@construccion/types';

/**
 * DTO for creating a new project
 */
export class CreateProjectDto {
  @ApiProperty({
    description: 'Project name',
    example: 'Edificio Residencial XYZ',
    minLength: 3,
    maxLength: 200,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  name: string;

  @ApiPropertyOptional({
    description: 'Project description',
    example: 'Desarrollo residencial de 50 unidades',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Client/Owner name',
    example: 'Constructora ABC S.A.',
    minLength: 2,
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  client: string;

  @ApiProperty({
    description: 'Project location',
    example: 'Av. Principal 123, Ciudad de México',
  })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: 'Project start date (ISO 8601)',
    example: '2024-01-15',
  })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiPropertyOptional({
    description: 'Estimated end date (ISO 8601)',
    example: '2024-12-31',
  })
  @IsDateString()
  @IsOptional()
  @ValidateIf((o) => o.estimatedEndDate !== undefined)
  estimatedEndDate?: string;

  @ApiPropertyOptional({
    description: 'Project status',
    enum: ProjectStatus,
    default: ProjectStatus.DRAFT,
  })
  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;
}
