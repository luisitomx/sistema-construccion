import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UnitPriceAnalysis } from './unit-price-analysis.entity';

export enum ConceptCategory {
  PRELIMINARES = 'PRELIMINARES',
  CIMIENTOS = 'CIMIENTOS',
  ESTRUCTURA = 'ESTRUCTURA',
  ALBANILERIA = 'ALBANILERIA',
  INSTALACIONES = 'INSTALACIONES',
  ACABADOS = 'ACABADOS',
  CARPINTERIA = 'CARPINTERIA',
}

@Entity('concepts')
export class Concept {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20 })
  unit: string;

  @Column({ type: 'enum', enum: ConceptCategory })
  category: ConceptCategory;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'uuid', nullable: true })
  unitPriceAnalysisId: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToOne(() => UnitPriceAnalysis, { nullable: true })
  @JoinColumn({ name: 'unitPriceAnalysisId' })
  unitPriceAnalysis: UnitPriceAnalysis;
}
