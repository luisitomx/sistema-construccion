import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

// Entities
import { Schedule } from './domain/entities/schedule.entity';
import { Activity } from './domain/entities/activity.entity';
import { Dependency } from './domain/entities/dependency.entity';
import { ResourceAssignment } from './domain/entities/resource-assignment.entity';
import { WorkLog } from './domain/entities/work-log.entity';
import { Photo } from './domain/entities/photo.entity';

// Controllers
import { SchedulesController } from './infrastructure/http/controllers/schedules.controller';
import { WorkLogsController } from './infrastructure/http/controllers/work-logs.controller';
import { PhotosController } from './infrastructure/http/controllers/photos.controller';

// Use Cases and Services
import { CPMCalculator } from './application/use-cases/cpm-calculator.service';
import { CalculateCriticalPathUseCase } from './application/use-cases/calculate-critical-path.use-case';
import { GenerateGanttDataUseCase } from './application/use-cases/generate-gantt-data.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD', 'postgres'),
        database: configService.get('DB_DATABASE', 'schedule_db'),
        entities: [Schedule, Activity, Dependency, ResourceAssignment, WorkLog, Photo],
        synchronize: configService.get('DB_SYNC', 'true') === 'true',
        logging: configService.get('DB_LOGGING', 'false') === 'true',
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Schedule, Activity, Dependency, ResourceAssignment, WorkLog, Photo]),
  ],
  controllers: [SchedulesController, WorkLogsController, PhotosController],
  providers: [CPMCalculator, CalculateCriticalPathUseCase, GenerateGanttDataUseCase],
})
export class AppModule {}
