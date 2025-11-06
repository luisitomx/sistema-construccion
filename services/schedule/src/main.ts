import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Schedule Service API')
    .setDescription(
      'Servicio de Programación de Obras - CPM (Critical Path Method) y Gantt Charts\n\n' +
        'Características:\n' +
        '- Gestión de cronogramas de obra\n' +
        '- Cálculo de Ruta Crítica (CPM)\n' +
        '- Generación de datos para Diagrama de Gantt\n' +
        '- Gestión de actividades y dependencias\n' +
        '- Soporte para múltiples tipos de dependencias (FS, SS, FF, SF)\n' +
        '- Cálculo de holguras (Total Float, Free Float)\n' +
        '- Asignación de recursos a actividades\n' +
        '- Integración con espacios y partidas presupuestarias',
    )
    .setVersion('1.0')
    .addTag('schedules', 'Gestión de cronogramas y cálculo CPM')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT || 3005;
  await app.listen(port);

  console.log(`\n🚀 Schedule Service running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs\n`);
  console.log('Endpoints:');
  console.log('  - POST   /api/v1/schedules');
  console.log('  - GET    /api/v1/schedules');
  console.log('  - GET    /api/v1/schedules/:id');
  console.log('  - PUT    /api/v1/schedules/:id');
  console.log('  - DELETE /api/v1/schedules/:id');
  console.log('  - POST   /api/v1/schedules/:id/activities');
  console.log('  - GET    /api/v1/schedules/:id/activities');
  console.log('  - POST   /api/v1/schedules/:id/dependencies');
  console.log('  - GET    /api/v1/schedules/:id/dependencies');
  console.log('  - POST   /api/v1/schedules/:id/calculate     (Run CPM)');
  console.log('  - GET    /api/v1/schedules/:id/gantt         (Gantt data)\n');
}

bootstrap();
