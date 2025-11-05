import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Drawing } from './drawing.entity';
import { Polyline } from './polyline.entity';

@Entity('layers')
export class Layer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  drawingId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 7, default: '#FFFFFF' })
  color: string;

  @Column({ type: 'boolean', default: true })
  isVisible: boolean;

  @Column({ type: 'boolean', default: false })
  isFrozen: boolean;

  // Relaciones
  @ManyToOne(() => Drawing, (drawing) => drawing.layers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'drawingId' })
  drawing: Drawing;

  @OneToMany(() => Polyline, (polyline) => polyline.layer, { cascade: true })
  polylines: Polyline[];
}
