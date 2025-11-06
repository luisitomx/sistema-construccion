import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Schedule } from './schedule.entity';
import { Dependency } from './dependency.entity';
import { ResourceAssignment } from './resource-assignment.entity';
import { WorkLog } from './work-log.entity';
import { Photo } from './photo.entity';

@Entity('activities')
@Index('idx_activity_schedule_id', ['scheduleId'])
@Index('idx_activity_is_critical', ['isCritical'])
@Index('idx_activity_space_id', ['spaceId'])
@Index('idx_activity_budget_item_id', ['budgetItemId'])
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

  @OneToMany(() => WorkLog, (workLog) => workLog.activity, { cascade: true })
  workLogs: WorkLog[];

  @OneToMany(() => Photo, (photo) => photo.activity, { cascade: true })
  photos: Photo[];
}
