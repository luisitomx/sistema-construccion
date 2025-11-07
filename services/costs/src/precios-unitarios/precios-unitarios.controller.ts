import { Controller, Post, Get, Body, Query, Param } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from '@nestjs/swagger';
import { CalculadoraPuService } from './services/calculadora-pu.service';
import { MaterialesService, MaterialResult } from './services/materiales.service';
import { ConceptosService } from './services/conceptos.service';
import { CalcularPuDto } from './dto/calcular-pu.dto';
import {
  ConceptoQueryDto,
  MaterialQueryDto,
} from './dto/concepto-query.dto';

@ApiTags('Precios Unitarios')
@Controller('precios-unitarios')
export class PreciosUnitariosController {
  constructor(
    private calculadora: CalculadoraPuService,
    private materialesService: MaterialesService,
    private conceptosService: ConceptosService,
  ) {}

  @Post('calcular')
  @ApiOperation({
    summary: 'Calcular precio unitario dinámicamente',
    description:
      'Calcula un precio unitario basado en el concepto y configuración de proyecto',
  })
  @ApiResponse({
    status: 201,
    description: 'Precio unitario calculado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Concepto o rendimiento no encontrado' })
  async calcularPU(@Body() dto: CalcularPuDto) {
    return this.calculadora.calcularPrecioUnitario(dto);
  }

  @Get('conceptos')
  @ApiOperation({ summary: 'Listar conceptos disponibles' })
  @ApiQuery({ name: 'partida', required: false })
  @ApiQuery({ name: 'subpartida', required: false })
  @ApiQuery({ name: 'tipoObra', required: false })
  @ApiQuery({ name: 'busqueda', required: false })
  async listarConceptos(@Query() query: ConceptoQueryDto) {
    return this.conceptosService.listarConceptos(
      query.partida,
      query.subpartida,
      query.tipoObra,
      query.busqueda,
    );
  }

  @Get('conceptos/partidas')
  @ApiOperation({ summary: 'Listar partidas disponibles' })
  async obtenerPartidas() {
    return this.conceptosService.obtenerPartidas();
  }

  @Get('conceptos/partidas/:partida/subpartidas')
  @ApiOperation({ summary: 'Listar subpartidas de una partida' })
  async obtenerSubpartidas(@Param('partida') partida: string) {
    return this.conceptosService.obtenerSubpartidas(partida);
  }

  @Get('conceptos/:clave')
  @ApiOperation({ summary: 'Obtener detalle de un concepto' })
  @ApiResponse({ status: 200, description: 'Concepto encontrado' })
  @ApiResponse({ status: 404, description: 'Concepto no encontrado' })
  async obtenerConcepto(@Param('clave') clave: string) {
    return this.conceptosService.obtenerConcepto(clave);
  }

  @Get('materiales')
  @ApiOperation({ summary: 'Listar materiales disponibles' })
  @ApiQuery({ name: 'categoria', required: false })
  @ApiQuery({ name: 'subcategoria', required: false })
  async listarMateriales(@Query() query: MaterialQueryDto): Promise<MaterialResult[]> {
    return this.materialesService.listarMateriales(
      query.categoria,
      query.subcategoria,
    );
  }

  @Get('materiales/categorias')
  @ApiOperation({ summary: 'Listar categorías de materiales' })
  async obtenerCategorias(): Promise<string[]> {
    return this.materialesService.obtenerCategorias();
  }

  @Get('materiales/:clave')
  @ApiOperation({ summary: 'Obtener detalle de un material' })
  @ApiResponse({ status: 200, description: 'Material encontrado' })
  @ApiResponse({ status: 404, description: 'Material no encontrado' })
  async obtenerMaterial(@Param('clave') clave: string): Promise<MaterialResult> {
    const material = await this.materialesService.obtenerMaterial(clave);
    if (!material) {
      throw new Error(`Material ${clave} no encontrado`);
    }
    return material;
  }
}
