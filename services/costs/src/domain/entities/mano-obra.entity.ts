import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('mano_obra')
export class ManoObra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  clave: string;

  @Column({ type: 'varchar', length: 50 })
  categoria: string;

  @Column({ type: 'varchar', length: 100 })
  especialidad: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'salario_base' })
  salarioBase: number;

  @Column({
    type: 'decimal',
    precision: 4,
    scale: 3,
    default: 1.50,
    name: 'factor_salario_real'
  })
  factorSalarioReal: number;

  @Column({ type: 'jsonb', nullable: true })
  prestaciones: any;

  @Column({ type: 'varchar', length: 50, nullable: true })
  region: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'fecha_actualizacion' })
  fechaActualizacion: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
