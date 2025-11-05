import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Layer } from './layer.entity';
import { Polyline } from './polyline.entity';

export enum DrawingStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  PARSED = 'PARSED',
  ERROR = 'ERROR',
}

export enum FileType {
  DWG = 'DWG',
  DXF = 'DXF',
}

@Entity('drawings')
export class Drawing {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  projectId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  fileName: string;

  @Column({ type: 'text' })
  fileUrl: string;

  @Column({ type: 'bigint' })
  fileSize: number;

  @Column({ type: 'enum', enum: FileType })
  fileType: FileType;

  @Column({ type: 'varchar', length: 50, nullable: true })
  version: string;

  @Column({ type: 'uuid' })
  uploadedBy: string;

  @Column({ type: 'enum', enum: DrawingStatus, default: DrawingStatus.UPLOADED })
  status: DrawingStatus;

  @Column({ type: 'text', nullable: true })
  errorMessage: string;

  // Metadata
  @Column({ type: 'varchar', length: 20, nullable: true })
  units: string;

  @Column({ type: 'jsonb', nullable: true })
  boundingBox: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };

  @Column({ type: 'int', default: 0 })
  layersCount: number;

  @Column({ type: 'int', default: 0 })
  polylinesCount: number;

  @CreateDateColumn()
  uploadedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  parsedAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => Layer, (layer) => layer.drawing, { cascade: true })
  layers: Layer[];

  @OneToMany(() => Polyline, (polyline) => polyline.drawing, { cascade: true })
  polylines: Polyline[];
}
