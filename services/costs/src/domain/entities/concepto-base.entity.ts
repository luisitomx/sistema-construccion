import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { InsumoConcepto } from './insumo-concepto.entity';
import { PrecioUnitarioCalculado } from './precio-unitario-calculado.entity';

@Entity('conceptos_base')
export class ConceptoBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  clave: string;

  @Column({ type: 'varchar', length: 200 })
  nombre: string;

  @Column({ type: 'text' })
  descripcion: string;

  @Column({ type: 'varchar', length: 10 })
  unidad: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  partida: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  subpartida: string;

  @Column({
    type: 'varchar',
    length: 50,
    default: 'casa_habitacion',
    name: 'tipo_obra'
  })
  tipoObra: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relaciones
  @OneToMany(() => InsumoConcepto, (insumo) => insumo.concepto, { cascade: true })
  insumos: InsumoConcepto[];

  @OneToMany(() => PrecioUnitarioCalculado, (precio) => precio.concepto)
  preciosCalculados: PrecioUnitarioCalculado[];
}
