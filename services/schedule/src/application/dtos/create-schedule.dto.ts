import { IsString, IsUUID, IsNotEmpty, IsOptional, IsDateString, Length } from 'class-validator';

export class CreateScheduleDto {
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
