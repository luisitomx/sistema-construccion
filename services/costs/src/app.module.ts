import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Concept } from './domain/entities/concept.entity';
import { UnitPriceAnalysis } from './domain/entities/unit-price-analysis.entity';
import { Material } from './domain/entities/material.entity';
import { Labor } from './domain/entities/labor.entity';
import { Equipment } from './domain/entities/equipment.entity';
import { Budget } from './domain/entities/budget.entity';
import { BudgetItem } from './domain/entities/budget-item.entity';

// Use Cases
import { CalculateUnitPriceUseCase } from './application/use-cases/calculate-unit-price.use-case';
import { CalculateBudgetUseCase } from './application/use-cases/calculate-budget.use-case';
import { ExplodeMaterialsUseCase } from './application/use-cases/explode-materials.use-case';

// Controllers
import { ConceptsController } from './infrastructure/http/controllers/concepts.controller';
import { BudgetsController } from './infrastructure/http/controllers/budgets.controller';
import {
  MaterialsController,
  LaborController,
  EquipmentController,
} from './infrastructure/http/controllers/resources.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'construccion_costs'),
        entities: [
          Concept,
          UnitPriceAnalysis,
          Material,
          Labor,
          Equipment,
          Budget,
          BudgetItem,
        ],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    TypeOrmModule.forFeature([
      Concept,
      UnitPriceAnalysis,
      Material,
      Labor,
      Equipment,
      Budget,
      BudgetItem,
    ]),
  ],
  controllers: [
    ConceptsController,
    BudgetsController,
    MaterialsController,
    LaborController,
    EquipmentController,
  ],
  providers: [
    CalculateUnitPriceUseCase,
    CalculateBudgetUseCase,
    ExplodeMaterialsUseCase,
  ],
})
export class AppModule {}
