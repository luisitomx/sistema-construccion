import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConceptoBase } from '../../domain/entities/concepto-base.entity';

export interface MaterialResult {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  unidad: string;
  precioUnitario: number;
  factorMerma: number;
  categoria: string;
  subcategoria: string;
  proveedor: string;
  activo: boolean;
}

@Injectable()
export class MaterialesService {
  constructor(
    @InjectRepository(ConceptoBase)
    private conceptoRepository: Repository<ConceptoBase>,
  ) {}

  async listarMateriales(
    categoria?: string,
    subcategoria?: string,
  ): Promise<MaterialResult[]> {
    let query = `
      SELECT id, clave, nombre, descripcion, unidad,
             precio_unitario, factor_merma, categoria,
             subcategoria, proveedor, activo
      FROM materiales
      WHERE activo = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (categoria) {
      query += ` AND categoria = $${paramIndex}`;
      params.push(categoria);
      paramIndex++;
    }

    if (subcategoria) {
      query += ` AND subcategoria = $${paramIndex}`;
      params.push(subcategoria);
      paramIndex++;
    }

    query += ' ORDER BY clave ASC';

    const result = await this.conceptoRepository.query(query, params);

    return result.map((row: any) => ({
      id: row.id,
      clave: row.clave,
      nombre: row.nombre,
      descripcion: row.descripcion,
      unidad: row.unidad,
      precioUnitario: Number(row.precio_unitario),
      factorMerma: Number(row.factor_merma),
      categoria: row.categoria,
      subcategoria: row.subcategoria,
      proveedor: row.proveedor,
      activo: row.activo,
    }));
  }

  async obtenerMaterial(clave: string): Promise<MaterialResult | null> {
    const result = await this.conceptoRepository.query(
      `SELECT id, clave, nombre, descripcion, unidad,
              precio_unitario, factor_merma, categoria,
              subcategoria, proveedor, activo
       FROM materiales
       WHERE clave = $1 AND activo = true`,
      [clave],
    );

    if (result.length === 0) {
      return null;
    }

    const row = result[0];
    return {
      id: row.id,
      clave: row.clave,
      nombre: row.nombre,
      descripcion: row.descripcion,
      unidad: row.unidad,
      precioUnitario: Number(row.precio_unitario),
      factorMerma: Number(row.factor_merma),
      categoria: row.categoria,
      subcategoria: row.subcategoria,
      proveedor: row.proveedor,
      activo: row.activo,
    };
  }

  async obtenerCategorias(): Promise<string[]> {
    const result = await this.conceptoRepository.query(
      `SELECT DISTINCT categoria
       FROM materiales
       WHERE activo = true AND categoria IS NOT NULL
       ORDER BY categoria ASC`,
    );

    return result.map((row: any) => row.categoria);
  }
}
