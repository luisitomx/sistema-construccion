import { IsNotEmpty, IsUUID, IsDateString, IsString, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkLogDto {
  @ApiProperty({
    description: 'Activity ID this work log belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  activityId: string;

  @ApiProperty({
    description: 'Date of the work log',
    example: '2025-01-15',
  })
  @IsNotEmpty()
  @IsDateString()
  logDate: string;

  @ApiProperty({
    description: 'Description of work completed',
    example: 'Completed foundation excavation for zone A',
  })
  @IsNotEmpty()
  @IsString()
  workDone: string;

  @ApiProperty({
    description: 'Total hours worked',
    example: 8.5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  hoursWorked: number;

  @ApiProperty({
    description: 'Number of workers on site',
    example: 12,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  workersCount: number;

  @ApiProperty({
    description: 'Progress percentage achieved today',
    example: 15.5,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  progressPercentage: number;

  @ApiProperty({
    description: 'Additional notes',
    example: 'Good progress, no issues encountered',
    required: false,
  })
  @IsString()
  notes?: string;

  @ApiProperty({
    description: 'Weather conditions',
    example: 'Sunny',
    enum: ['Sunny', 'Rainy', 'Cloudy', 'Windy', 'Other'],
  })
  @IsNotEmpty()
  @IsString()
  weather: string;

  @ApiProperty({
    description: 'User ID who reported this log',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  reportedBy: string;
}
