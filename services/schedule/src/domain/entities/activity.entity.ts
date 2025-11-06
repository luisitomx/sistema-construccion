import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { Dependency } from './dependency.entity';
import { ResourceAssignment } from './resource-assignment.entity';

@Entity('activities')
export class Activity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  scheduleId: string;

  @Column({ type: 'varchar', length: 50 })
  code: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Duration in days
  @Column({ type: 'int' })
  duration: number;

  // CPM Calculations
  @Column({ type: 'int', default: 0 })
  earlyStart: number;

  @Column({ type: 'int', default: 0 })
  earlyFinish: number;

  @Column({ type: 'int', default: 0 })
  lateStart: number;

  @Column({ type: 'int', default: 0 })
  lateFinish: number;

  @Column({ type: 'int', default: 0 })
  totalFloat: number;

  @Column({ type: 'int', default: 0 })
  freeFloat: number;

  @Column({ type: 'boolean', default: false })
  isCritical: boolean;

  // Progress tracking
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  percentComplete: number;

  @Column({ type: 'date', nullable: true })
  actualStart: Date;

  @Column({ type: 'date', nullable: true })
  actualFinish: Date;

  // Linking
  @Column({ type: 'uuid', nullable: true })
  spaceId: string;

  @Column({ type: 'uuid', nullable: true })
  budgetItemId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Schedule, (schedule) => schedule.activities, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scheduleId' })
  schedule: Schedule;

  @OneToMany(() => Dependency, (dep) => dep.predecessor)
  successors: Dependency[];

  @OneToMany(() => Dependency, (dep) => dep.successor)
  predecessors: Dependency[];

  @OneToMany(() => ResourceAssignment, (assignment) => assignment.activity, { cascade: true })
  resourceAssignments: ResourceAssignment[];
}
