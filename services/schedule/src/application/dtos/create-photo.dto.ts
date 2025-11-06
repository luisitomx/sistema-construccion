import { IsNotEmpty, IsUUID, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePhotoDto {
  @ApiProperty({
    description: 'Activity ID this photo belongs to',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  activityId: string;

  @ApiProperty({
    description: 'Remote URL where the photo is stored (e.g., S3)',
    example: 'https://s3.amazonaws.com/bucket/photos/abc123.jpg',
  })
  @IsNotEmpty()
  @IsString()
  remoteUrl: string;

  @ApiProperty({
    description: 'Photo caption or description',
    example: 'Foundation excavation progress',
    required: false,
  })
  @IsOptional()
  @IsString()
  caption?: string;

  @ApiProperty({
    description: 'User ID who took the photo',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsNotEmpty()
  @IsUUID()
  takenBy: string;

  @ApiProperty({
    description: 'Date and time when the photo was taken',
    example: '2025-01-15T14:30:00Z',
  })
  @IsNotEmpty()
  @IsDateString()
  takenAt: string;
}
