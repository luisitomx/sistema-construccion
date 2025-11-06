import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { SpaceCategory } from '@construccion/types';

import { Space } from './space.entity';

/**
 * SpaceType Entity - Tipo de espacio arquitectónico
 * Define categorías predefinidas de espacios (Cocina, Baño, etc.)
 */
@Entity('space_types')
export class SpaceType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({
    type: 'enum',
    enum: SpaceCategory,
  })
  category: SpaceCategory;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  defaultCostPerM2?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  typicalArea?: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => Space, (space) => space.spaceType)
  spaces: Space[];
}
