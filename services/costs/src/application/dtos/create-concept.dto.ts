import { IsString, IsEnum, IsNotEmpty, IsOptional, Length } from 'class-validator';
import { ConceptCategory } from '../../domain/entities/concept.entity';

export class CreateConceptDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  code: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 20)
  unit: string;

  @IsEnum(ConceptCategory)
  @IsNotEmpty()
  category: ConceptCategory;

  @IsString()
  @IsOptional()
  description?: string;
}
