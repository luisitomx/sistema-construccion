# Microservicio Programa Arquitectónico

El **núcleo del Sistema de Construcción** - Gestiona el Programa Arquitectónico y genera el **"Objeto Génesis" (Espacio_ID)** que conecta todos los módulos del sistema.

## Concepto Clave: El "Objeto Génesis"

Cada espacio arquitectónico tiene un `Espacio_ID` único (UUID) que se propaga por todos los módulos:

```
Programa Arquitectónico → Diseño CAD → Costos → Cronograma → Ejecución
         ↓                    ↓           ↓          ↓            ↓
    Espacio_ID          Espacio_ID   Espacio_ID  Espacio_ID  Espacio_ID
```

**Ventaja**: Trazabilidad completa. Un cambio en el diseño impacta automáticamente costos y fechas.

## Arquitectura

Este microservicio sigue **Clean Architecture / Arquitectura Hexagonal**:

```
src/
├── domain/              # Entidades, Value Objects, Interfaces de Repositorios
│   ├── entities/        # Project, Space (Espacio_ID), SpaceType
│   ├── value-objects/   # Area
│   └── repositories/    # Interfaces
├── application/         # Casos de Uso y DTOs
│   ├── use-cases/       # Lógica de negocio pura
│   └── dtos/            # Validaciones con class-validator
├── infrastructure/      # Implementaciones concretas
│   ├── database/        # TypeORM, Repositories, Seeds
│   └── http/            # Controllers, Filters, Middlewares
└── presentation/        # Entry point (main.ts)
```

## Stack Tecnológico

- **Framework**: NestJS 10+ con TypeScript 5+
- **ORM**: TypeORM
- **Base de Datos**: PostgreSQL 16
- **Validación**: class-validator + class-transformer
- **Documentación**: Swagger/OpenAPI
- **Testing**: Jest

## Quick Start

### 1. Prerrequisitos

Asegúrate de que Docker Compose está corriendo con PostgreSQL:

```bash
# Desde la raíz del monorepo
npm run infra:up
```

### 2. Instalar Dependencias

```bash
# Desde la raíz del monorepo
npm install
```

### 3. Configurar Variables de Entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

### 4. Seed de Datos

Poblar la base de datos con tipos de espacios predefinidos:

```bash
npm run seed
```

### 5. Ejecutar en Desarrollo

```bash
npm run dev
```

El servicio estará disponible en:
- **API**: http://localhost:3001/api/v1
- **Swagger**: http://localhost:3001/api/docs

## Endpoints Principales

### Projects

```
POST   /api/v1/projects              # Crear proyecto
GET    /api/v1/projects              # Listar proyectos (paginado)
GET    /api/v1/projects/:id          # Obtener proyecto
PUT    /api/v1/projects/:id          # Actualizar proyecto
DELETE /api/v1/projects/:id          # Eliminar proyecto
GET    /api/v1/projects/:id/spaces   # Espacios del proyecto
```

### Spaces (Espacio_ID)

```
POST   /api/v1/spaces                # Crear espacio (genera Espacio_ID)
GET    /api/v1/spaces/:id            # Obtener espacio
PUT    /api/v1/spaces/:id            # Actualizar espacio
PATCH  /api/v1/spaces/:id/area       # Actualizar área real (desde DWG)
DELETE /api/v1/spaces/:id            # Eliminar espacio
```

### Space Types

```
GET    /api/v1/space-types           # Listar tipos de espacios
```

## Modelos de Datos

### Project

```typescript
{
  id: string;                    // UUID
  name: string;                  // Nombre del proyecto
  client: string;                // Cliente
  location: string;              // Ubicación
  startDate: Date;
  estimatedEndDate?: Date;
  status: ProjectStatus;         // DRAFT, ACTIVE, COMPLETED, CANCELLED
  spaces: Space[];               // Relación 1:N
}
```

### Space (El "Objeto Génesis")

```typescript
{
  id: string;                    // UUID - El Espacio_ID que conecta todo
  projectId: string;
  name: string;                  // "Cocina", "Baño Principal"
  spaceTypeId: string;
  requiredArea: number;          // m² desde Programa Arquitectónico
  realArea?: number;             // m² calculado desde DWG
  quantity: number;              // Cantidad de espacios de este tipo
}
```

### SpaceType

```typescript
{
  id: string;
  name: string;                  // "Cocina", "Recámara", etc.
  category: SpaceCategory;       // RESIDENTIAL, COMMERCIAL, etc.
  typicalArea?: number;          // Área típica en m²
}
```

## Reglas de Negocio

### Projects

- ✅ La fecha de inicio no puede estar en el pasado
- ✅ La fecha estimada de fin debe ser posterior a la fecha de inicio
- ✅ No se puede eliminar un proyecto con espacios asociados

### Spaces

- ✅ El área requerida debe estar entre 0.01 y 10,000 m²
- ✅ La cantidad debe ser un entero entre 1 y 100
- ✅ El proyecto y el tipo de espacio deben existir
- ✅ El `realArea` se actualiza desde el Design Service

## Testing

```bash
# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

**Coverage objetivo**: 80%+ (configurado en jest.config)

## Scripts Disponibles

```bash
npm run build       # Compilar TypeScript
npm run dev         # Desarrollo con hot-reload
npm run start:prod  # Producción
npm run lint        # ESLint
npm run format      # Prettier
npm run test        # Tests
npm run test:cov    # Coverage
npm run seed        # Seed de datos
npm run clean       # Limpiar dist/
```

## Variables de Entorno

```env
# Application
NODE_ENV=development
PORT=3001

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=construccion_db
DATABASE_USER=admin
DATABASE_PASSWORD=admin123
DATABASE_SYNCHRONIZE=true
DATABASE_LOGGING=true

# API
API_PREFIX=api/v1
```

## Próximos Pasos

Este microservicio está listo para:

1. **Recibir conexiones del Design Service** para actualizar `realArea`
2. **Enviar eventos** a Cost Engine y Schedule Service cuando se creen/actualicen espacios
3. **Integrarse con API Gateway** GraphQL

## Documentación Adicional

- **Swagger UI**: http://localhost:3001/api/docs (cuando el servicio está corriendo)
- **Arquitectura General**: Ver `/docs/arquitectura/` en la raíz del monorepo

## Soporte

Para preguntas o problemas, consulta:
- `/docs` en la raíz del proyecto
- El archivo `CLAUDE.md` con los estándares del proyecto
