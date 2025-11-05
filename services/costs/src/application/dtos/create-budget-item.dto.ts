import { IsUUID, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateBudgetItemDto {
  @IsUUID()
  conceptId: string;

  @IsUUID()
  @IsOptional()
  spaceId?: string;

  @IsNumber()
  @Min(0)
  quantity: number;
}
