import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import Decimal from 'decimal.js';

import { ConceptoBase } from '../../domain/entities/concepto-base.entity';
import { InsumoConcepto } from '../../domain/entities/insumo-concepto.entity';
import { Rendimiento } from '../../domain/entities/rendimiento.entity';
import { ManoObra } from '../../domain/entities/mano-obra.entity';
import { PrecioUnitarioCalculado } from '../../domain/entities/precio-unitario-calculado.entity';
import { CalcularPuDto } from '../dto/calcular-pu.dto';

// Interfaz para Material (tabla materiales)
interface MaterialPU {
  id: number;
  clave: string;
  nombre: string;
  precioUnitario: number;
  factorMerma: number;
  unidad: string;
}

@Injectable()
export class CalculadoraPuService {
  private readonly logger = new Logger(CalculadoraPuService.name);

  constructor(
    @InjectRepository(ConceptoBase)
    private conceptoRepository: Repository<ConceptoBase>,
    @InjectRepository(InsumoConcepto)
    private insumoRepository: Repository<InsumoConcepto>,
    @InjectRepository(Rendimiento)
    private rendimientoRepository: Repository<Rendimiento>,
    @InjectRepository(ManoObra)
    private manoObraRepository: Repository<ManoObra>,
    @InjectRepository(PrecioUnitarioCalculado)
    private precioCalculadoRepository: Repository<PrecioUnitarioCalculado>,
  ) {}

  async calcularPrecioUnitario(dto: CalcularPuDto) {
    this.logger.log(`Calculando PU para concepto: ${dto.conceptoClave}`);

    // 1. Obtener concepto base con sus insumos
    const concepto = await this.conceptoRepository.findOne({
      where: { clave: dto.conceptoClave, activo: true },
      relations: ['insumos'],
    });

    if (!concepto) {
      throw new NotFoundException(
        `Concepto ${dto.conceptoClave} no encontrado`,
      );
    }

    // 2. Calcular costo de materiales
    const { costo: costoMateriales, desglose: desgloseMateriales } =
      await this.calcularCostoMateriales(
        concepto.insumos.filter((i) => i.tipoInsumo === 'material'),
        dto.ajustesPersonalizados?.materiales,
      );

    // 3. Obtener rendimiento
    const rendimiento = await this.rendimientoRepository.findOne({
      where: { conceptoClave: dto.conceptoClave },
    });

    if (!rendimiento) {
      throw new NotFoundException(
        `Rendimiento para ${dto.conceptoClave} no encontrado`,
      );
    }

    // 4. Calcular costo de mano de obra
    const { costo: costoManoObra, desglose: desgloseManoObra } =
      await this.calcularCostoManoObra(
        rendimiento,
        dto.ajustesPersonalizados?.rendimiento,
      );

    // 5. Calcular herramienta (3% típico sobre MO)
    const costoHerramienta = new Decimal(costoManoObra).times(0.03);

    // 6. Costo directo
    const costoDirecto = new Decimal(costoMateriales)
      .plus(costoManoObra)
      .plus(costoHerramienta);

    // 7. Aplicar factores de sobrecosto
    const indirectosTotal = new Decimal(dto.configuracion.indirectosCampo)
      .plus(dto.configuracion.indirectosOficina);

    const indirectos = costoDirecto.times(indirectosTotal).dividedBy(100);
    const subtotal = costoDirecto.plus(indirectos);

    const financiamiento = subtotal
      .times(dto.configuracion.financiamiento)
      .dividedBy(100);
    const utilidad = subtotal.times(dto.configuracion.utilidad).dividedBy(100);
    const cargosAdicionales = dto.configuracion.cargosAdicionales
      ? subtotal.times(dto.configuracion.cargosAdicionales).dividedBy(100)
      : new Decimal(0);

    const precioUnitarioTotal = subtotal
      .plus(financiamiento)
      .plus(utilidad)
      .plus(cargosAdicionales);

    // 8. Construir desglose completo
    const desgloseJson = {
      concepto: {
        clave: concepto.clave,
        nombre: concepto.nombre,
        unidad: concepto.unidad,
      },
      materiales: desgloseMateriales,
      manoObra: desgloseManoObra,
      herramienta: {
        descripcion: 'Herramienta menor',
        porcentaje: 3.0,
        base: Number(costoManoObra.toFixed(2)),
        costo: Number(costoHerramienta.toFixed(2)),
      },
      resumen: {
        costoDirecto: Number(costoDirecto.toFixed(2)),
        indirectos: {
          porcentaje: Number(indirectosTotal.toFixed(2)),
          monto: Number(indirectos.toFixed(2)),
        },
        subtotal: Number(subtotal.toFixed(2)),
        financiamiento: {
          porcentaje: dto.configuracion.financiamiento,
          monto: Number(financiamiento.toFixed(2)),
        },
        utilidad: {
          porcentaje: dto.configuracion.utilidad,
          monto: Number(utilidad.toFixed(2)),
        },
        cargosAdicionales: {
          porcentaje: dto.configuracion.cargosAdicionales || 0,
          monto: Number(cargosAdicionales.toFixed(2)),
        },
        total: Number(precioUnitarioTotal.toFixed(2)),
      },
      configuracion: dto.configuracion,
      fechaCalculo: new Date(),
    };

    // 9. Guardar en BD
    const resultado = await this.precioCalculadoRepository.save({
      conceptoId: concepto.id,
      costoMateriales: Number(costoMateriales.toFixed(2)),
      costoManoObra: Number(costoManoObra.toFixed(2)),
      costoHerramienta: Number(costoHerramienta.toFixed(2)),
      costoAuxiliares: 0,
      costoDirecto: Number(costoDirecto.toFixed(2)),
      indirectos: Number(indirectos.toFixed(2)),
      financiamiento: Number(financiamiento.toFixed(2)),
      utilidad: Number(utilidad.toFixed(2)),
      cargosAdicionales: Number(cargosAdicionales.toFixed(2)),
      precioUnitarioTotal: Number(precioUnitarioTotal.toFixed(2)),
      desgloseJson,
    });

    this.logger.log(
      `PU calculado: ${precioUnitarioTotal.toFixed(2)} para ${concepto.clave}`,
    );

    return {
      id: resultado.id,
      concepto: {
        clave: concepto.clave,
        nombre: concepto.nombre,
        unidad: concepto.unidad,
      },
      costos: {
        materiales: costoMateriales.toFixed(2),
        manoObra: costoManoObra.toFixed(2),
        herramienta: costoHerramienta.toFixed(2),
        costoDirecto: costoDirecto.toFixed(2),
        indirectos: indirectos.toFixed(2),
        subtotal: subtotal.toFixed(2),
        financiamiento: financiamiento.toFixed(2),
        utilidad: utilidad.toFixed(2),
        cargosAdicionales: cargosAdicionales.toFixed(2),
        precioUnitarioTotal: precioUnitarioTotal.toFixed(2),
      },
      desglose: desgloseJson,
    };
  }

  private async calcularCostoMateriales(
    insumos: InsumoConcepto[],
    ajustes?: { [clave: string]: number },
  ): Promise<{ costo: Decimal; desglose: any[] }> {
    let total = new Decimal(0);
    const desglose: any[] = [];

    for (const insumo of insumos) {
      // Query raw a tabla materiales
      const material = await this.conceptoRepository.query(
        `SELECT id, clave, nombre, precio_unitario, factor_merma, unidad
         FROM materiales WHERE clave = $1 AND activo = true`,
        [insumo.insumoClave],
      );

      if (material && material.length > 0) {
        const mat: MaterialPU = {
          id: material[0].id,
          clave: material[0].clave,
          nombre: material[0].nombre,
          precioUnitario: Number(material[0].precio_unitario),
          factorMerma: Number(material[0].factor_merma),
          unidad: material[0].unidad,
        };

        const cantidad = ajustes?.[insumo.insumoClave] ?? insumo.cantidad;
        const costo = new Decimal(cantidad)
          .times(mat.precioUnitario)
          .times(mat.factorMerma);

        total = total.plus(costo);

        desglose.push({
          clave: mat.clave,
          nombre: mat.nombre,
          unidad: mat.unidad,
          cantidad: Number(cantidad),
          precioUnitario: mat.precioUnitario,
          factorMerma: mat.factorMerma,
          importe: Number(costo.toFixed(2)),
        });
      }
    }

    return { costo: total, desglose };
  }

  private async calcularCostoManoObra(
    rendimiento: Rendimiento,
    ajusteRendimiento?: number,
  ): Promise<{ costo: Decimal; desglose: any[] }> {
    const rend = ajusteRendimiento ?? rendimiento.rendimiento;
    const rendimientoInverso = new Decimal(1).dividedBy(rend);
    const cuadrilla = rendimiento.cuadrilla as any;

    let total = new Decimal(0);
    const desglose: any[] = [];

    for (const [tipo, cantidad] of Object.entries(cuadrilla)) {
      // Buscar en mano_obra por especialidad que contenga el tipo
      const trabajador = await this.manoObraRepository.findOne({
        where: {
          activo: true,
        },
      });

      // Búsqueda case-insensitive por especialidad
      const trabajadores = await this.manoObraRepository
        .createQueryBuilder('mo')
        .where('LOWER(mo.especialidad) LIKE LOWER(:tipo)', {
          tipo: `%${tipo}%`,
        })
        .andWhere('mo.activo = :activo', { activo: true })
        .getMany();

      if (trabajadores && trabajadores.length > 0) {
        const trabajadorData = trabajadores[0];
        const jornadas = rendimientoInverso.times(cantidad as number);
        const costo = jornadas
          .times(trabajadorData.salarioBase)
          .times(trabajadorData.factorSalarioReal);

        total = total.plus(costo);

        desglose.push({
          tipo,
          especialidad: trabajadorData.especialidad,
          cantidad: cantidad as number,
          salarioBase: Number(trabajadorData.salarioBase),
          factorSalarioReal: Number(trabajadorData.factorSalarioReal),
          jornadas: Number(jornadas.toFixed(6)),
          importe: Number(costo.toFixed(2)),
        });
      }
    }

    return { costo: total, desglose };
  }

  async obtenerDetalleConcepto(clave: string) {
    const concepto = await this.conceptoRepository.findOne({
      where: { clave, activo: true },
      relations: ['insumos'],
    });

    if (!concepto) {
      throw new NotFoundException(`Concepto ${clave} no encontrado`);
    }

    const rendimiento = await this.rendimientoRepository.findOne({
      where: { conceptoClave: clave },
    });

    return {
      ...concepto,
      rendimiento,
    };
  }

  async listarConceptos(partida?: string, tipoObra?: string) {
    const query = this.conceptoRepository.createQueryBuilder('c');
    query.where('c.activo = :activo', { activo: true });

    if (partida) {
      query.andWhere('c.partida = :partida', { partida });
    }

    if (tipoObra) {
      query.andWhere('c.tipoObra = :tipoObra', { tipoObra });
    }

    query.orderBy('c.clave', 'ASC');

    return query.getMany();
  }
}
