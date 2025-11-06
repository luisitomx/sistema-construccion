import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('rendimientos')
export class Rendimiento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200 })
  actividad: string;

  @Column({ type: 'varchar', length: 20, nullable: true, name: 'concepto_clave' })
  conceptoClave: string;

  @Column({ type: 'varchar', length: 10 })
  unidad: string;

  @Column({ type: 'jsonb' })
  cuadrilla: any; // { "Oficial": 1, "Ayudante": 1 }

  @Column({ type: 'decimal', precision: 8, scale: 4 })
  rendimiento: number; // m2/jornada, m/jornada, etc.

  @Column({ type: 'decimal', precision: 8, scale: 6, nullable: true, name: 'rendimiento_inverso' })
  rendimientoInverso: number; // jornadas/m2 (1/rendimiento)

  @Column({ type: 'text', nullable: true })
  condiciones: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  fuente: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  region: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
