import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('herramienta_equipo')
export class HerramientaEquipo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  clave: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  tipo: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true, name: 'costo_horario' })
  costoHorario: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 2,
    nullable: true,
    default: 3.00,
    name: 'porcentaje_sobre_mo'
  })
  porcentajeSobreMo: number;

  @Column({ type: 'integer', nullable: true, name: 'vida_util_horas' })
  vidaUtilHoras: number;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
