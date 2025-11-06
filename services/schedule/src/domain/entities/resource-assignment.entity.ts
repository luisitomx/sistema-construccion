import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Activity } from './activity.entity';

export enum ResourceType {
  LABOR = 'LABOR',
  EQUIPMENT = 'EQUIPMENT',
  MATERIAL = 'MATERIAL',
}

@Entity('resource_assignments')
export class ResourceAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  activityId: string;

  @Column({ type: 'enum', enum: ResourceType })
  resourceType: ResourceType;

  @Column({ type: 'uuid' })
  resourceId: string;

  @Column({ type: 'varchar', length: 255 })
  resourceName: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  quantity: number;

  @Column({ type: 'varchar', length: 20 })
  unit: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  cost: number;

  // Relaciones
  @ManyToOne(() => Activity, (activity) => activity.resourceAssignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'activityId' })
  activity: Activity;
}
