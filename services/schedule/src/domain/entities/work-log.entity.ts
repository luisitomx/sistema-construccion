import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Activity } from './activity.entity';

@Entity('work_logs')
@Index('idx_work_log_activity_id', ['activityId'])
@Index('idx_work_log_date', ['logDate'])
@Index('idx_work_log_reported_by', ['reportedBy'])
export class WorkLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  activityId: string;

  @Column({ type: 'date' })
  logDate: Date;

  @Column({ type: 'text' })
  workDone: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  hoursWorked: number;

  @Column({ type: 'int' })
  workersCount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  progressPercentage: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 50 })
  weather: string; // Sunny, Rainy, Cloudy

  @Column({ type: 'uuid' })
  reportedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  activity: Activity;
}
