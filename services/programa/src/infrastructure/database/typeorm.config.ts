import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

import { Project } from '@/domain/entities/project.entity';
import { Space } from '@/domain/entities/space.entity';
import { SpaceType } from '@/domain/entities/space-type.entity';

/**
 * TypeORM configuration factory
 */
export const typeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST', 'localhost'),
  port: configService.get<number>('DATABASE_PORT', 5432),
  username: configService.get<string>('DATABASE_USER', 'admin'),
  password: configService.get<string>('DATABASE_PASSWORD', 'admin123'),
  database: configService.get<string>('DATABASE_NAME', 'construccion_db'),
  entities: [Project, Space, SpaceType],
  synchronize: configService.get<boolean>('DATABASE_SYNCHRONIZE', true),
  logging: configService.get<boolean>('DATABASE_LOGGING', false),
  autoLoadEntities: true,
});
