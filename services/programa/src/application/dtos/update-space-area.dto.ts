import { IsNumber, IsPositive, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO for updating real area from DWG
 * This is called from the Design Service after linking DWG polylines
 */
export class UpdateSpaceAreaDto {
  @ApiProperty({
    description: 'Real area calculated from DWG in m²',
    example: 12.75,
    minimum: 0.01,
    maximum: 10000,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Max(10000)
  realArea: number;
}
