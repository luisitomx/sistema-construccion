import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Activity } from './activity.entity';

export enum DependencyType {
  FINISH_TO_START = 'FINISH_TO_START',   // FS (most common)
  START_TO_START = 'START_TO_START',     // SS
  FINISH_TO_FINISH = 'FINISH_TO_FINISH', // FF
  START_TO_FINISH = 'START_TO_FINISH',   // SF (rare)
}

@Entity('dependencies')
export class Dependency {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  predecessorId: string;

  @Column({ type: 'uuid' })
  successorId: string;

  @Column({ type: 'enum', enum: DependencyType, default: DependencyType.FINISH_TO_START })
  type: DependencyType;

  @Column({ type: 'int', default: 0 })
  lag: number;

  // Relaciones
  @ManyToOne(() => Activity, (activity) => activity.successors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'predecessorId' })
  predecessor: Activity;

  @ManyToOne(() => Activity, (activity) => activity.predecessors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'successorId' })
  successor: Activity;
}
