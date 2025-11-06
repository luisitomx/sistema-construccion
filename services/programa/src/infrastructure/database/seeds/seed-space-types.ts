import { DataSource } from 'typeorm';

import { SpaceCategory } from '@construccion/types';

import { SpaceType } from '@/domain/entities/space-type.entity';

/**
 * Seed data for Space Types
 * These are the predefined space types for construction projects
 */
export const seedSpaceTypesData = [
  // Residencial
  {
    name: 'Recámara',
    category: SpaceCategory.RESIDENTIAL,
    typicalArea: 12,
    description: 'Habitación para dormir',
  },
  {
    name: 'Baño',
    category: SpaceCategory.RESIDENTIAL,
    typicalArea: 4,
    description: 'Baño completo',
  },
  {
    name: 'Cocina',
    category: SpaceCategory.RESIDENTIAL,
    typicalArea: 8,
    description: 'Cocina integral',
  },
  {
    name: 'Sala',
    category: SpaceCategory.RESIDENTIAL,
    typicalArea: 20,
    description: 'Sala de estar',
  },
  {
    name: 'Comedor',
    category: SpaceCategory.RESIDENTIAL,
    typicalArea: 12,
    description: 'Comedor',
  },
  {
    name: 'Estudio',
    category: SpaceCategory.RESIDENTIAL,
    typicalArea: 10,
    description: 'Estudio u oficina en casa',
  },
  {
    name: 'Lavandería',
    category: SpaceCategory.RESIDENTIAL,
    typicalArea: 4,
    description: 'Cuarto de lavado',
  },

  // Comercial
  {
    name: 'Oficina',
    category: SpaceCategory.COMMERCIAL,
    typicalArea: 15,
    description: 'Oficina individual o compartida',
  },
  {
    name: 'Sala de Juntas',
    category: SpaceCategory.COMMERCIAL,
    typicalArea: 25,
    description: 'Sala de reuniones',
  },
  {
    name: 'Recepción',
    category: SpaceCategory.COMMERCIAL,
    typicalArea: 20,
    description: 'Área de recepción',
  },
  {
    name: 'Almacén',
    category: SpaceCategory.COMMERCIAL,
    typicalArea: 30,
    description: 'Bodega o almacén',
  },
];

/**
 * Seed Space Types into database
 * Idempotent - will not create duplicates
 */
export async function seedSpaceTypes(dataSource: DataSource): Promise<void> {
  const spaceTypeRepository = dataSource.getRepository(SpaceType);

  console.log('🌱 Seeding Space Types...');

  for (const data of seedSpaceTypesData) {
    // Check if already exists
    const existing = await spaceTypeRepository.findOne({
      where: { name: data.name },
    });

    if (!existing) {
      const spaceType = spaceTypeRepository.create(data);
      await spaceTypeRepository.save(spaceType);
      console.log(`  ✓ Created: ${data.name} (${data.category})`);
    } else {
      console.log(`  - Skipped: ${data.name} (already exists)`);
    }
  }

  console.log('✅ Space Types seeding completed!\n');
}
