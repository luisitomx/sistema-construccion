import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ConceptoQueryDto {
  @ApiProperty({
    example: 'Albañilería',
    description: 'Filtrar por partida',
    required: false,
  })
  @IsOptional()
  @IsString()
  partida?: string;

  @ApiProperty({
    example: 'Muros',
    description: 'Filtrar por subpartida',
    required: false,
  })
  @IsOptional()
  @IsString()
  subpartida?: string;

  @ApiProperty({
    example: 'casa_habitacion',
    description: 'Filtrar por tipo de obra',
    required: false,
  })
  @IsOptional()
  @IsString()
  tipoObra?: string;

  @ApiProperty({
    example: 'muro',
    description: 'Buscar en nombre o descripción',
    required: false,
  })
  @IsOptional()
  @IsString()
  busqueda?: string;
}

export class MaterialQueryDto {
  @ApiProperty({
    example: 'Cemento',
    description: 'Filtrar por categoría',
    required: false,
  })
  @IsOptional()
  @IsString()
  categoria?: string;

  @ApiProperty({
    example: 'Cementantes',
    description: 'Filtrar por subcategoría',
    required: false,
  })
  @IsOptional()
  @IsString()
  subcategoria?: string;

  @ApiProperty({
    example: 'cemento',
    description: 'Buscar en nombre o descripción',
    required: false,
  })
  @IsOptional()
  @IsString()
  busqueda?: string;
}
