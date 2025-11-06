import { DataSource } from 'typeorm';
import { Schedule, ScheduleStatus } from '../../../domain/entities/schedule.entity';
import { Activity } from '../../../domain/entities/activity.entity';
import { Dependency, DependencyType } from '../../../domain/entities/dependency.entity';
import { ResourceAssignment } from '../../../domain/entities/resource-assignment.entity';

/**
 * Seed data for Schedule Service
 *
 * Creates a sample construction project schedule demonstrating:
 * - Critical Path Method (CPM)
 * - Activity dependencies (FS, SS relationships)
 * - Resource assignments
 * - Integration with spaces and budget items
 */
export async function seedScheduleData(dataSource: DataSource) {
  const scheduleRepo = dataSource.getRepository(Schedule);
  const activityRepo = dataSource.getRepository(Activity);
  const dependencyRepo = dataSource.getRepository(Dependency);
  const resourceRepo = dataSource.getRepository(ResourceAssignment);

  console.log('🌱 Seeding Schedule Service data...');

  // Clear existing data
  await resourceRepo.delete({});
  await dependencyRepo.delete({});
  await activityRepo.delete({});
  await scheduleRepo.delete({});

  // =============================
  // 1. Create Schedule
  // =============================
  const schedule = scheduleRepo.create({
    projectId: '00000000-0000-0000-0000-000000000001', // Reference to project from Programa Service
    name: 'Cronograma Casa Habitación 120m²',
    description: 'Cronograma maestro para construcción de casa habitación de 120m²',
    startDate: new Date('2025-01-15'),
    status: ScheduleStatus.DRAFT,
    createdBy: '00000000-0000-0000-0000-000000000099', // Sample user ID
  });
  await scheduleRepo.save(schedule);

  console.log('✅ Schedule created:', schedule.id);

  // =============================
  // 2. Create Activities
  // =============================
  // Activity structure follows construction sequence:
  // PRELIMINARES → CIMIENTOS → ESTRUCTURA → ALBANILERIA → INSTALACIONES → ACABADOS

  const activities = [
    // PRELIMINARES
    {
      code: 'ACT-001',
      name: 'Limpieza y trazo',
      description: 'Limpieza del terreno y trazo topográfico',
      duration: 2,
      spaceId: null, // Site-wide activity
      budgetItemId: null,
    },
    {
      code: 'ACT-002',
      name: 'Excavación para cimientos',
      description: 'Excavación de zanjas para cimientos corridos',
      duration: 3,
      spaceId: null,
      budgetItemId: null,
    },

    // CIMIENTOS
    {
      code: 'ACT-003',
      name: 'Plantilla de concreto',
      description: 'Colado de plantilla de concreto pobre',
      duration: 1,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-004',
      name: 'Armado de cimientos',
      description: 'Habilitado y armado de acero en cimientos',
      duration: 3,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-005',
      name: 'Colado de cimientos',
      description: 'Colado de concreto en cimientos corridos',
      duration: 1,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-006',
      name: 'Rellenos',
      description: 'Rellenos y compactación',
      duration: 2,
      spaceId: null,
      budgetItemId: null,
    },

    // ESTRUCTURA
    {
      code: 'ACT-007',
      name: 'Armado de castillos y cadenas',
      description: 'Habilitado y armado de acero de refuerzo',
      duration: 4,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-008',
      name: 'Muros de carga PB',
      description: 'Levantamiento de muros de block en planta baja',
      duration: 8,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-009',
      name: 'Colado de castillos y cadenas',
      description: 'Colado de elementos de concreto',
      duration: 2,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-010',
      name: 'Losa de entrepiso',
      description: 'Cimbra, armado y colado de losa',
      duration: 10,
      spaceId: null,
      budgetItemId: null,
    },

    // ALBANILERIA
    {
      code: 'ACT-011',
      name: 'Muros interiores',
      description: 'Muros divisorios interiores',
      duration: 6,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-012',
      name: 'Aplanados interiores',
      description: 'Aplanados en muros y plafones',
      duration: 8,
      spaceId: null,
      budgetItemId: null,
    },

    // INSTALACIONES (pueden hacerse en paralelo)
    {
      code: 'ACT-013',
      name: 'Instalación hidráulica',
      description: 'Red de agua fría y caliente',
      duration: 5,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-014',
      name: 'Instalación sanitaria',
      description: 'Red de drenaje y ventilación',
      duration: 5,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-015',
      name: 'Instalación eléctrica',
      description: 'Red eléctrica y alumbrado',
      duration: 6,
      spaceId: null,
      budgetItemId: null,
    },

    // ACABADOS
    {
      code: 'ACT-016',
      name: 'Pisos',
      description: 'Firmes y colocación de pisos',
      duration: 8,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-017',
      name: 'Azulejos',
      description: 'Colocación de azulejos en baños y cocina',
      duration: 4,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-018',
      name: 'Muebles de baño y cocina',
      description: 'Instalación de muebles y accesorios',
      duration: 3,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-019',
      name: 'Pintura',
      description: 'Pintura vinílica en muros y plafones',
      duration: 5,
      spaceId: null,
      budgetItemId: null,
    },
    {
      code: 'ACT-020',
      name: 'Limpieza final',
      description: 'Limpieza general de obra',
      duration: 2,
      spaceId: null,
      budgetItemId: null,
    },
  ];

  const savedActivities: Activity[] = [];
  for (const actData of activities) {
    const activity = activityRepo.create({
      ...actData,
      scheduleId: schedule.id,
      percentComplete: 0,
    });
    const saved = await activityRepo.save(activity);
    savedActivities.push(saved);
    console.log(`  ✅ Activity: ${saved.code} - ${saved.name}`);
  }

  // =============================
  // 3. Create Dependencies (FS = Finish-to-Start)
  // =============================
  const dependencies = [
    // PRELIMINARES sequence
    { pred: 0, succ: 1 }, // Limpieza → Excavación

    // CIMIENTOS sequence
    { pred: 1, succ: 2 }, // Excavación → Plantilla
    { pred: 2, succ: 3 }, // Plantilla → Armado cimientos
    { pred: 3, succ: 4 }, // Armado → Colado cimientos
    { pred: 4, succ: 5 }, // Colado → Rellenos

    // ESTRUCTURA sequence
    { pred: 5, succ: 6 }, // Rellenos → Armado castillos
    { pred: 6, succ: 7 }, // Armado castillos → Muros PB
    { pred: 7, succ: 8 }, // Muros PB → Colado castillos
    { pred: 8, succ: 9 }, // Colado castillos → Losa

    // ALBANILERIA sequence
    { pred: 9, succ: 10 }, // Losa → Muros interiores
    { pred: 10, succ: 11 }, // Muros interiores → Aplanados

    // INSTALACIONES (can start after aplanados, run in parallel)
    { pred: 11, succ: 12 }, // Aplanados → Inst. hidráulica
    { pred: 11, succ: 13 }, // Aplanados → Inst. sanitaria
    { pred: 11, succ: 14 }, // Aplanados → Inst. eléctrica

    // ACABADOS sequence
    { pred: 12, succ: 15 }, // Hidráulica → Pisos
    { pred: 13, succ: 15 }, // Sanitaria → Pisos
    { pred: 14, succ: 15 }, // Eléctrica → Pisos
    { pred: 15, succ: 16 }, // Pisos → Azulejos
    { pred: 16, succ: 17 }, // Azulejos → Muebles
    { pred: 17, succ: 18 }, // Muebles → Pintura
    { pred: 18, succ: 19 }, // Pintura → Limpieza final
  ];

  for (const dep of dependencies) {
    const dependency = dependencyRepo.create({
      predecessorId: savedActivities[dep.pred].id,
      successorId: savedActivities[dep.succ].id,
      type: DependencyType.FINISH_TO_START,
      lag: 0,
    });
    await dependencyRepo.save(dependency);
  }

  console.log(`✅ Created ${dependencies.length} dependencies`);

  // =============================
  // 4. Create Resource Assignments (sample)
  // =============================
  const resources = [
    { activityIndex: 0, resourceName: 'Cuadrilla de limpieza', quantity: 3 },
    { activityIndex: 1, resourceName: 'Operador de retroexcavadora', quantity: 1 },
    { activityIndex: 1, resourceName: 'Peones', quantity: 2 },
    { activityIndex: 4, resourceName: 'Fierreros', quantity: 3 },
    { activityIndex: 7, resourceName: 'Albañiles', quantity: 4 },
    { activityIndex: 7, resourceName: 'Peones', quantity: 4 },
    { activityIndex: 9, resourceName: 'Carpinteros', quantity: 3 },
    { activityIndex: 9, resourceName: 'Fierreros', quantity: 2 },
    { activityIndex: 12, resourceName: 'Plomeros', quantity: 2 },
    { activityIndex: 14, resourceName: 'Electricistas', quantity: 2 },
    { activityIndex: 15, resourceName: 'Instaladores de piso', quantity: 3 },
    { activityIndex: 18, resourceName: 'Pintores', quantity: 3 },
  ];

  for (const res of resources) {
    const resourceAssignment = resourceRepo.create({
      activityId: savedActivities[res.activityIndex].id,
      resourceName: res.resourceName,
      quantity: res.quantity,
    });
    await resourceRepo.save(resourceAssignment);
  }

  console.log(`✅ Created ${resources.length} resource assignments`);

  console.log('\n✅ Seed data created successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - 1 Schedule: "${schedule.name}"`);
  console.log(`   - ${savedActivities.length} Activities`);
  console.log(`   - ${dependencies.length} Dependencies`);
  console.log(`   - ${resources.length} Resource Assignments`);
  console.log('\n💡 Next steps:');
  console.log(`   1. Calculate CPM: POST /api/v1/schedules/${schedule.id}/calculate`);
  console.log(`   2. View Gantt: GET /api/v1/schedules/${schedule.id}/gantt`);
  console.log(`   3. Critical path will be identified after CPM calculation\n`);

  return { schedule, activities: savedActivities };
}

// CLI execution
if (require.main === module) {
  const { DataSource } = require('typeorm');
  const { Schedule } = require('../../../domain/entities/schedule.entity');
  const { Activity } = require('../../../domain/entities/activity.entity');
  const { Dependency } = require('../../../domain/entities/dependency.entity');
  const { ResourceAssignment } = require('../../../domain/entities/resource-assignment.entity');

  const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_DATABASE || 'schedule_db',
    entities: [Schedule, Activity, Dependency, ResourceAssignment],
    synchronize: true,
  });

  dataSource
    .initialize()
    .then(async () => {
      await seedScheduleData(dataSource);
      await dataSource.destroy();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error seeding data:', error);
      process.exit(1);
    });
}
