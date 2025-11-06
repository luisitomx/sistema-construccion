import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('factores_sobrecosto')
export class FactorSobrecosto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer', nullable: true, name: 'proyecto_id' })
  proyectoId: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 50, name: 'tipo_cliente' })
  tipoCliente: string; // 'privado', 'gobierno'

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.00, name: 'indirectos_campo' })
  indirectosCampo: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 8.00, name: 'indirectos_oficina' })
  indirectosOficina: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 3.00 })
  financiamiento: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 12.00 })
  utilidad: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.00, name: 'cargos_adicionales' })
  cargosAdicionales: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE', name: 'fecha_vigencia' })
  fechaVigencia: Date;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
