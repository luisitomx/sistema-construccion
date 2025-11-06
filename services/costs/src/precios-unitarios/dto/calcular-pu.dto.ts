import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  ValidateNested,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum TipoCliente {
  PRIVADO = 'privado',
  GOBIERNO = 'gobierno',
}

export class ConfiguracionProyectoDto {
  @ApiProperty({
    enum: TipoCliente,
    example: TipoCliente.PRIVADO,
    description: 'Tipo de cliente: privado o gobierno',
  })
  @IsEnum(TipoCliente)
  tipoCliente: TipoCliente;

  @ApiProperty({
    example: 5,
    description: 'Porcentaje de indirectos de campo (%)',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  indirectosCampo: number;

  @ApiProperty({
    example: 8,
    description: 'Porcentaje de indirectos de oficina (%)',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  indirectosOficina: number;

  @ApiProperty({
    example: 3,
    description: 'Porcentaje de financiamiento (%)',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  financiamiento: number;

  @ApiProperty({
    example: 12,
    description: 'Porcentaje de utilidad (%)',
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  utilidad: number;

  @ApiProperty({
    example: 0,
    description: 'Porcentaje de cargos adicionales (%)',
    required: false,
  })
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  cargosAdicionales?: number;
}

export class AjustesPersonalizadosDto {
  @ApiProperty({
    example: { 'CEM-001': 0.015 },
    description: 'Ajustes de cantidad para materiales específicos',
    required: false,
  })
  @IsOptional()
  materiales?: { [clave: string]: number };

  @ApiProperty({
    example: 5.0,
    description: 'Ajuste de rendimiento (m2/jornada, m/jornada, etc.)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  rendimiento?: number;
}

export class CalcularPuDto {
  @ApiProperty({
    example: 'ALBA-001',
    description: 'Clave del concepto a calcular',
  })
  @IsString()
  conceptoClave: string;

  @ApiProperty({
    type: ConfiguracionProyectoDto,
    description: 'Configuración de factores de sobrecosto',
  })
  @ValidateNested()
  @Type(() => ConfiguracionProyectoDto)
  configuracion: ConfiguracionProyectoDto;

  @ApiProperty({
    type: AjustesPersonalizadosDto,
    description: 'Ajustes personalizados opcionales',
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => AjustesPersonalizadosDto)
  ajustesPersonalizados?: AjustesPersonalizadosDto;
}
