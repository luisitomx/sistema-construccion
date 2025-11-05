import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Drawing } from './drawing.entity';
import { Layer } from './layer.entity';
import { SpacePolylineLink } from './space-polyline-link.entity';

export interface Vertex {
  x: number;
  y: number;
  bulge?: number;
}

@Entity('polylines')
export class Polyline {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  drawingId: string;

  @Column({ type: 'uuid' })
  layerId: string;

  // Geometría
  @Column({ type: 'jsonb' })
  vertices: Vertex[];

  @Column({ type: 'boolean', default: false })
  isClosed: boolean;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  area: number;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  perimeter: number;

  // Visual
  @Column({ type: 'varchar', length: 7, default: '#FFFFFF' })
  color: string;

  // Relaciones
  @ManyToOne(() => Drawing, (drawing) => drawing.polylines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'drawingId' })
  drawing: Drawing;

  @ManyToOne(() => Layer, (layer) => layer.polylines, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'layerId' })
  layer: Layer;

  @OneToMany(() => SpacePolylineLink, (link) => link.polyline, { cascade: true })
  spaceLinks: SpacePolylineLink[];
}
