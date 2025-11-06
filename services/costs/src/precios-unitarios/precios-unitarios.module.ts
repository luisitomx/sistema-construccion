import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { ConceptoBase } from '../domain/entities/concepto-base.entity';
import { InsumoConcepto } from '../domain/entities/insumo-concepto.entity';
import { ManoObra } from '../domain/entities/mano-obra.entity';
import { Rendimiento } from '../domain/entities/rendimiento.entity';
import { HerramientaEquipo } from '../domain/entities/herramienta-equipo.entity';
import { FactorSobrecosto } from '../domain/entities/factor-sobrecosto.entity';
import { PrecioUnitarioCalculado } from '../domain/entities/precio-unitario-calculado.entity';

// Services
import { CalculadoraPuService } from './services/calculadora-pu.service';
import { MaterialesService } from './services/materiales.service';
import { ConceptosService } from './services/conceptos.service';

// Controller
import { PreciosUnitariosController } from './precios-unitarios.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ConceptoBase,
      InsumoConcepto,
      ManoObra,
      Rendimiento,
      HerramientaEquipo,
      FactorSobrecosto,
      PrecioUnitarioCalculado,
    ]),
  ],
  controllers: [PreciosUnitariosController],
  providers: [
    CalculadoraPuService,
    MaterialesService,
    ConceptosService,
  ],
  exports: [CalculadoraPuService],
})
export class PreciosUnitariosModule {}
