import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Project } from './project.entity';
import { SpaceType } from './space-type.entity';

/**
 * Space Entity - El "Objeto Génesis" del sistema
 * Cada espacio tiene un Espacio_ID único que se propaga por todos los módulos
 * Este ID conecta: Programa → Diseño → Costos → Cronograma → Ejecución
 */
@Entity('spaces')
export class Space {
  /**
   * Espacio_ID - El identificador único que conecta todo el sistema
   */
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  code?: string;

  @Column({ type: 'uuid' })
  spaceTypeId: string;

  /**
   * Área requerida desde el Programa Arquitectónico (m²)
   */
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  requiredArea: number;

  /**
   * Área real calculada desde DWG (m²)
   * Null hasta que se vincule con el diseño
   */
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  realArea?: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'integer', nullable: true })
  floor?: number;

  @Column({ type: 'integer', default: 1 })
  quantity: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Project, (project) => project.spaces, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'projectId' })
  project: Project;

  @ManyToOne(() => SpaceType, (spaceType) => spaceType.spaces)
  @JoinColumn({ name: 'spaceTypeId' })
  spaceType: SpaceType;
}
