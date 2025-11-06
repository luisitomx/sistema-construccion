import { IsUUID, IsEnum, IsInt, IsNotEmpty, IsOptional } from 'class-validator';
import { DependencyType } from '../../domain/entities/dependency.entity';

export class CreateDependencyDto {
  @IsUUID()
  @IsNotEmpty()
  predecessorId: string;

  @IsUUID()
  @IsNotEmpty()
  successorId: string;

  @IsEnum(DependencyType)
  @IsOptional()
  type?: DependencyType;

  @IsInt()
  @IsOptional()
  lag?: number;
}
