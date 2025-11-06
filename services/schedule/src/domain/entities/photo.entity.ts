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

@Entity('photos')
@Index('idx_photo_activity_id', ['activityId'])
@Index('idx_photo_taken_by', ['takenBy'])
@Index('idx_photo_taken_at', ['takenAt'])
export class Photo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  activityId: string;

  @Column({ type: 'text' })
  remoteUrl: string; // S3 URL or similar

  @Column({ type: 'varchar', length: 255, nullable: true })
  caption: string;

  @Column({ type: 'uuid' })
  takenBy: string;

  @Column({ type: 'timestamp' })
  takenAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @ManyToOne(() => Activity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  activity: Activity;
}
