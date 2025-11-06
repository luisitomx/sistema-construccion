import { IsOptional, IsInt, IsDateString, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateActivityDto {
  @ApiProperty({
    description: 'Progress percentage (0-100)',
    example: 75,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  percentComplete?: number;

  @ApiProperty({
    description: 'Actual start date of the activity',
    example: '2025-01-15T08:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  actualStart?: string;

  @ApiProperty({
    description: 'Actual finish date of the activity',
    example: '2025-01-20T17:00:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  actualFinish?: string;
}
