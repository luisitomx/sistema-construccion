import { DataSource } from 'typeorm';
import { Concept, ConceptCategory } from '../../../domain/entities/concept.entity';
import { Material } from '../../../domain/entities/material.entity';
import { Labor, LaborCategory } from '../../../domain/entities/labor.entity';
import { Equipment } from '../../../domain/entities/equipment.entity';

const dataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'construccion_costs',
  entities: [Concept, Material, Labor, Equipment],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  console.log('Seeding materials...');
  const materialRepo = dataSource.getRepository(Material);
  const materials = await materialRepo.save([
    {
      code: 'MAT-001',
      name: 'Cemento Portland CPC 30',
      unit: 'ton',
      currentPrice: 150,
      supplier: 'CEMEX',
    },
    {
      code: 'MAT-002',
      name: 'Arena',
      unit: 'm³',
      currentPrice: 25,
    },
    {
      code: 'MAT-003',
      name: 'Grava 3/4"',
      unit: 'm³',
      currentPrice: 30,
    },
    {
      code: 'MAT-004',
      name: 'Block 15x20x40',
      unit: 'pza',
      currentPrice: 8,
    },
    {
      code: 'MAT-005',
      name: 'Varilla 3/8"',
      unit: 'ton',
      currentPrice: 800,
    },
    {
      code: 'MAT-006',
      name: 'Alambre recocido',
      unit: 'kg',
      currentPrice: 1.5,
    },
    {
      code: 'MAT-007',
      name: 'Madera para cimbra',
      unit: 'm²',
      currentPrice: 45,
    },
  ]);

  console.log('Seeding labor...');
  const laborRepo = dataSource.getRepository(Labor);
  const labor = await laborRepo.save([
    {
      code: 'MO-001',
      name: 'Peón',
      category: LaborCategory.PEON,
      hourlyRate: 15,
    },
    {
      code: 'MO-002',
      name: 'Oficial Albañil',
      category: LaborCategory.OFICIAL,
      hourlyRate: 25,
    },
    {
      code: 'MO-003',
      name: 'Maestro de Obra',
      category: LaborCategory.MAESTRO,
      hourlyRate: 35,
    },
    {
      code: 'MO-004',
      name: 'Fierrero',
      category: LaborCategory.OFICIAL,
      hourlyRate: 28,
    },
    {
      code: 'MO-005',
      name: 'Carpintero',
      category: LaborCategory.OFICIAL,
      hourlyRate: 27,
    },
  ]);

  console.log('Seeding equipment...');
  const equipmentRepo = dataSource.getRepository(Equipment);
  const equipment = await equipmentRepo.save([
    {
      code: 'EQ-001',
      name: 'Revolvedora 1 saco',
      category: 'Mezclado',
      hourlyRate: 12,
    },
    {
      code: 'EQ-002',
      name: 'Vibrador de concreto',
      category: 'Compactación',
      hourlyRate: 8,
    },
    {
      code: 'EQ-003',
      name: 'Andamio tubular',
      category: 'Acceso',
      hourlyRate: 5,
    },
  ]);

  console.log('Seeding concepts...');
  const conceptRepo = dataSource.getRepository(Concept);
  await conceptRepo.save([
    {
      code: '01.01.01',
      name: 'Limpieza de terreno',
      unit: 'm²',
      category: ConceptCategory.PRELIMINARES,
      description: 'Limpieza manual del terreno',
    },
    {
      code: '02.01.01',
      name: 'Excavación a mano',
      unit: 'm³',
      category: ConceptCategory.CIMIENTOS,
      description: 'Excavación manual de cepas',
    },
    {
      code: '03.01.01',
      name: 'Cimbra común en muros',
      unit: 'm²',
      category: ConceptCategory.ESTRUCTURA,
      description: 'Fabricación, habilitado y colocación de cimbra',
    },
    {
      code: '03.01.02',
      name: 'Concreto f\'c=250 kg/cm²',
      unit: 'm³',
      category: ConceptCategory.ESTRUCTURA,
      description: 'Concreto hecho en obra',
    },
    {
      code: '03.02.01',
      name: 'Acero de refuerzo fy=4200 kg/cm²',
      unit: 'ton',
      category: ConceptCategory.ESTRUCTURA,
      description: 'Habilitado, armado y colocación de acero',
    },
    {
      code: '04.01.01',
      name: 'Muro de block 15x20x40',
      unit: 'm²',
      category: ConceptCategory.ALBANILERIA,
      description: 'Muro de block hueco',
    },
  ]);

  console.log('Seed completed successfully!');
  await dataSource.destroy();
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
