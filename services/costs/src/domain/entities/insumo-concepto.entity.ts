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

@Entity('insumos_concepto')
export class InsumoConcepto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', name: 'concepto_id' })
  conceptoId: number;

  @Column({ type: 'varchar', length: 20, name: 'tipo_insumo' })
  tipoInsumo: string; // 'material', 'mano_obra', 'herramienta', 'auxiliar'

  @Column({ type: 'varchar', length: 20, name: 'insumo_clave' })
  insumoClave: string;

  @Column({ type: 'decimal', precision: 10, scale: 4 })
  cantidad: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => ConceptoBase, (concepto) => concepto.insumos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'concepto_id' })
  concepto: ConceptoBase;
}
