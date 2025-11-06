import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ConceptoBase } from './concepto-base.entity';

@Entity('precios_unitarios_calculados')
export class PrecioUnitarioCalculado {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: true, name: 'proyecto_id' })
  proyectoId: number;

  @Column({ type: 'integer', name: 'concepto_id' })
  conceptoId: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'costo_materiales' })
  costoMateriales: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'costo_mano_obra' })
  costoManoObra: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'costo_herramienta' })
  costoHerramienta: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00, name: 'costo_auxiliares' })
  costoAuxiliares: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'costo_directo' })
  costoDirecto: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  indirectos: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  financiamiento: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  utilidad: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.00, name: 'cargos_adicionales' })
  cargosAdicionales: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'precio_unitario_total' })
  precioUnitarioTotal: number;

  @Column({ type: 'jsonb', name: 'desglose_json' })
  desgloseJson: any;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'fecha_calculo' })
  fechaCalculo: Date;

  @Column({ type: 'integer', nullable: true, name: 'calculado_por' })
  calculadoPor: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => ConceptoBase, (concepto) => concepto.preciosCalculados)
  @JoinColumn({ name: 'concepto_id' })
  concepto: ConceptoBase;
}
