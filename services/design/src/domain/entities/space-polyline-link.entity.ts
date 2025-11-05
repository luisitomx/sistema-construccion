import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Polyline } from './polyline.entity';

export enum LinkType {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
}

@Entity('space_polyline_links')
export class SpacePolylineLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  spaceId: string;

  @Column({ type: 'uuid' })
  polylineId: string;

  @Column({ type: 'enum', enum: LinkType, default: LinkType.MANUAL })
  linkType: LinkType;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  confidence: number;

  @Column({ type: 'uuid' })
  linkedBy: string;

  @CreateDateColumn()
  linkedAt: Date;

  // Relaciones
  @ManyToOne(() => Polyline, (polyline) => polyline.spaceLinks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'polylineId' })
  polyline: Polyline;
}
