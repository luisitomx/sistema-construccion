import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Concept } from './concept.entity';

export interface MaterialComponent {
  materialId: string;
  materialCode: string;
  materialName: string;
  materialUnit: string;
  quantity: number;
  wasteFactor: number;
  unitPrice: number;
  cost: number;
}

export interface LaborComponent {
  laborId: string;
  laborCode: string;
  laborName: string;
  hours: number;
  performance: number;
  hourlyRate: number;
  cost: number;
}

export interface EquipmentComponent {
  equipmentId: string;
  equipmentCode: string;
  equipmentName: string;
  hours: number;
  hourlyRate: number;
  cost: number;
}

@Entity('unit_price_analyses')
export class UnitPriceAnalysis {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  conceptId: string;

  // Componentes (almacenados como JSONB)
  @Column({ type: 'jsonb', default: [] })
  materials: MaterialComponent[];

  @Column({ type: 'jsonb', default: [] })
  labor: LaborComponent[];

  @Column({ type: 'jsonb', default: [] })
  equipment: EquipmentComponent[];

  // Factores (porcentajes)
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 15 })
  indirectCostFactor: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 10 })
  profitFactor: number;

  // Costos calculados
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  directCost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  indirectCost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  profit: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  totalUnitPrice: number;

  @Column({ type: 'date' })
  validFrom: Date;

  @Column({ type: 'date', nullable: true })
  validUntil: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Concept, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'conceptId' })
  concept: Concept;
}
