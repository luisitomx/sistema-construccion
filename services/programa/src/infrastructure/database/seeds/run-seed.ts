import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { Project } from '@/domain/entities/project.entity';
import { Space } from '@/domain/entities/space.entity';
import { SpaceType } from '@/domain/entities/space-type.entity';

import { seedSpaceTypes } from './seed-space-types';

// Load environment variables
dotenv.config();

/**
 * Main seed execution
 */
async function runSeed() {
  console.log('🚀 Starting database seed...\n');

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    username: process.env.DATABASE_USER || 'admin',
    password: process.env.DATABASE_PASSWORD || 'admin123',
    database: process.env.DATABASE_NAME || 'construccion_db',
    entities: [Project, Space, SpaceType],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connection established\n');

    // Run seeds
    await seedSpaceTypes(dataSource);

    console.log('🎉 All seeds completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
    }
  }
}

runSeed();
