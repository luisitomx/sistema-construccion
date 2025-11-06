import { IsString, IsInt, IsUUID, IsNotEmpty, IsOptional, Min, Length } from 'class-validator';

export class CreateActivityDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  duration: number;

  @IsUUID()
  @IsOptional()
  spaceId?: string;

  @IsUUID()
  @IsOptional()
  budgetItemId?: string;
}
