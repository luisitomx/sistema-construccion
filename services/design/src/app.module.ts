import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { Drawing } from './domain/entities/drawing.entity';
import { Layer } from './domain/entities/layer.entity';
import { Polyline } from './domain/entities/polyline.entity';
import { SpacePolylineLink } from './domain/entities/space-polyline-link.entity';

// Services
import { DxfParserService } from './infrastructure/parsers/dxf-parser.service';
import { StorageService } from './infrastructure/storage/storage.service';
import { ProgramaServiceClient } from './infrastructure/http/programa-service.client';

// Use Cases
import { UploadDrawingUseCase } from './application/use-cases/upload-drawing.use-case';
import { LinkSpaceToPolylineUseCase } from './application/use-cases/link-space-to-polyline.use-case';

// Controllers
import { DrawingsController } from './infrastructure/http/controllers/drawings.controller';

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
        database: configService.get('DB_DATABASE', 'construccion_design'),
        entities: [Drawing, Layer, Polyline, SpacePolylineLink],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),
    TypeOrmModule.forFeature([Drawing, Layer, Polyline, SpacePolylineLink]),
  ],
  controllers: [DrawingsController],
  providers: [
    DxfParserService,
    StorageService,
    ProgramaServiceClient,
    UploadDrawingUseCase,
    LinkSpaceToPolylineUseCase,
  ],
})
export class AppModule {}
