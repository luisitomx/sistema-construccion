import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ConceptoBase } from '../../domain/entities/concepto-base.entity';
import { Rendimiento } from '../../domain/entities/rendimiento.entity';

@Injectable()
export class ConceptosService {
  constructor(
    @InjectRepository(ConceptoBase)
    private conceptoRepository: Repository<ConceptoBase>,
    @InjectRepository(Rendimiento)
    private rendimientoRepository: Repository<Rendimiento>,
  ) {}

  async listarConceptos(
    partida?: string,
    subpartida?: string,
    tipoObra?: string,
    busqueda?: string,
  ) {
    const query = this.conceptoRepository.createQueryBuilder('c');
    query.where('c.activo = :activo', { activo: true });

    if (partida) {
      query.andWhere('c.partida = :partida', { partida });
    }

    if (subpartida) {
      query.andWhere('c.subpartida = :subpartida', { subpartida });
    }

    if (tipoObra) {
      query.andWhere('c.tipoObra = :tipoObra', { tipoObra });
    }

    if (busqueda) {
      query.andWhere(
        '(LOWER(c.nombre) LIKE LOWER(:busqueda) OR LOWER(c.descripcion) LIKE LOWER(:busqueda))',
        { busqueda: `%${busqueda}%` },
      );
    }

    query.orderBy('c.clave', 'ASC');

    return query.getMany();
  }

  async obtenerConcepto(clave: string) {
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

    // Obtener detalles de materiales
    const insumosMateriales = concepto.insumos.filter(
      (i) => i.tipoInsumo === 'material',
    );

    const materialesDetalle = [];
    for (const insumo of insumosMateriales) {
      const material = await this.conceptoRepository.query(
        `SELECT clave, nombre, unidad, precio_unitario, factor_merma
         FROM materiales WHERE clave = $1`,
        [insumo.insumoClave],
      );

      if (material.length > 0) {
        materialesDetalle.push({
          clave: material[0].clave,
          nombre: material[0].nombre,
          unidad: material[0].unidad,
          cantidad: Number(insumo.cantidad),
          precioUnitario: Number(material[0].precio_unitario),
          factorMerma: Number(material[0].factor_merma),
        });
      }
    }

    return {
      concepto,
      rendimiento,
      materiales: materialesDetalle,
    };
  }

  async obtenerPartidas(): Promise<string[]> {
    const result = await this.conceptoRepository
      .createQueryBuilder('c')
      .select('DISTINCT c.partida', 'partida')
      .where('c.activo = :activo', { activo: true })
      .andWhere('c.partida IS NOT NULL')
      .orderBy('c.partida', 'ASC')
      .getRawMany();

    return result.map((r) => r.partida);
  }

  async obtenerSubpartidas(partida: string): Promise<string[]> {
    const result = await this.conceptoRepository
      .createQueryBuilder('c')
      .select('DISTINCT c.subpartida', 'subpartida')
      .where('c.activo = :activo', { activo: true })
      .andWhere('c.partida = :partida', { partida })
      .andWhere('c.subpartida IS NOT NULL')
      .orderBy('c.subpartida', 'ASC')
      .getRawMany();

    return result.map((r) => r.subpartida);
  }
}
