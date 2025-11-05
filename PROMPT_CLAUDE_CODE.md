# 🚀 PROMPT INICIAL PARA CLAUDE CODE WEB

## Sesión 1: Setup del Proyecto + Microservicio Programa Arquitectónico

---

### Contexto del Proyecto

Estoy construyendo un **Sistema Integral de Gestión de Construcción** que unifica diseño, costos, programación y ejecución mediante un modelo de datos centralizado.

**Concepto clave**: El "Programa Arquitectónico" actúa como "Objeto Génesis" del sistema. Cada espacio tiene un `Espacio_ID` único que se propaga por todos los módulos, permitiendo trazabilidad completa.

### Archivo de Referencia

Este proyecto está basado en la arquitectura definida en el archivo `arquitectura-construccion.jsx` que visualiza todos los módulos del sistema.

Lee también el archivo `CLAUDE.md` en la raíz del proyecto que contiene todos los estándares, principios y estructura del proyecto.

---

## OBJETIVO DE ESTA SESIÓN

Implementar la **Fase 1 - MVP Core**:

1. ✅ Setup del monorepo con Turborepo
2. ✅ Configuración de TypeScript, ESLint, Prettier
3. ✅ Setup de Docker Compose (PostgreSQL + MongoDB + Redis)
4. ✅ Implementar el microservicio **Programa Arquitectónico** completo
5. ✅ Tests unitarios y de integración
6. ✅ Documentación básica

---

## INSTRUCCIONES IMPORTANTES

### 🔴 ANTES DE CODEAR:
1. **Lee el archivo CLAUDE.md** para entender los estándares del proyecto
2. **Crea un plan detallado** de todos los pasos que vas a ejecutar
3. **Muéstrame el plan** y espera mi aprobación
4. **NO escribas código** hasta que yo apruebe el plan

### ✅ DURANTE LA IMPLEMENTACIÓN:
- Sigue **Clean Architecture / Arquitectura Hexagonal**
- Usa **TypeScript estricto** (strict mode)
- Escribe **tests** para toda la lógica de negocio
- **Commits frecuentes** con mensajes descriptivos
- Usa los **nombres de archivos** especificados en CLAUDE.md

### 📋 AL FINALIZAR:
- Ejecuta **todos los tests** y asegúrate que pasen
- Actualiza el **README.md** con instrucciones de setup
- Crea un **CHANGELOG.md** con lo implementado
- Crea un **Pull Request** con descripción detallada

---

## ESTRUCTURA DEL MONOREPO

```
proyecto-construccion/
├── apps/
│   ├── web/                    # Next.js (Fase 2)
│   ├── mobile/                 # React Native (Fase 2)
│   └── api-gateway/            # GraphQL Gateway (Fase 1)
├── services/
│   ├── programa/               # 🎯 Microservicio a implementar HOY
│   ├── auth/                   # Auth service (Fase 1)
│   ├── design/                 # (Fase 2)
│   ├── costs/                  # (Fase 2)
│   ├── schedule/               # (Fase 2)
│   ├── execution/              # (Fase 2)
│   └── payroll/                # (Fase 3)
├── packages/
│   ├── ui/                     # Componentes compartidos
│   ├── types/                  # Tipos compartidos
│   ├── utils/                  # Utilidades
│   └── config/                 # Configs (ESLint, TS, etc)
├── infra/
│   └── docker/                 # Docker Compose files
├── docs/
│   └── arquitectura/
├── turbo.json                  # Configuración Turborepo
├── package.json                # Root package.json
├── CLAUDE.md                   # 📖 Estándares del proyecto
└── README.md
```

---

## MICROSERVICIO: PROGRAMA ARQUITECTÓNICO

### Estructura Interna del Microservicio

```
services/programa/
├── src/
│   ├── domain/
│   │   ├── entities/
│   │   │   ├── project.entity.ts
│   │   │   ├── space.entity.ts
│   │   │   └── space-type.entity.ts
│   │   ├── value-objects/
│   │   │   └── area.value-object.ts
│   │   └── repositories/
│   │       ├── project.repository.interface.ts
│   │       └── space.repository.interface.ts
│   ├── application/
│   │   ├── use-cases/
│   │   │   ├── projects/
│   │   │   │   ├── create-project.use-case.ts
│   │   │   │   ├── get-project.use-case.ts
│   │   │   │   ├── update-project.use-case.ts
│   │   │   │   └── delete-project.use-case.ts
│   │   │   └── spaces/
│   │   │       ├── create-space.use-case.ts
│   │   │       ├── get-spaces-by-project.use-case.ts
│   │   │       ├── update-space.use-case.ts
│   │   │       └── delete-space.use-case.ts
│   │   └── dtos/
│   │       ├── create-project.dto.ts
│   │       ├── create-space.dto.ts
│   │       └── ...
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── typeorm.config.ts
│   │   │   └── repositories/
│   │   │       ├── project.repository.ts
│   │   │       └── space.repository.ts
│   │   └── http/
│   │       ├── controllers/
│   │       │   ├── projects.controller.ts
│   │       │   └── spaces.controller.ts
│   │       └── middlewares/
│   └── presentation/
│       └── main.ts
├── test/
│   ├── unit/
│   └── integration/
├── Dockerfile
├── package.json
└── tsconfig.json
```

---

## MODELO DE DATOS

### Entidad: Project

```typescript
export class Project {
  id: string;                    // UUID
  name: string;                  // "Edificio Residencial XYZ"
  description?: string;
  client: string;                // Cliente/Owner
  location: string;              // Ubicación física
  startDate: Date;
  estimatedEndDate?: Date;
  status: ProjectStatus;         // DRAFT, ACTIVE, COMPLETED, CANCELLED
  createdAt: Date;
  updatedAt: Date;
  spaces: Space[];               // Relación 1:N
}

enum ProjectStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
```

### Entidad: Space

```typescript
export class Space {
  id: string;                    // UUID - El "Espacio_ID" génesis
  projectId: string;             // FK a Project
  name: string;                  // "Cocina", "Baño Principal"
  code?: string;                 // Código alfanumérico opcional "COC-01"
  spaceTypeId: string;           // FK a SpaceType
  requiredArea: number;          // m² desde Programa Arquitectónico
  realArea?: number;             // m² desde DWG (null hasta vinculación)
  description?: string;
  floor?: number;                // Nivel/Piso
  quantity: number;              // Cantidad de espacios (ej: 3 baños)
  
  // Metadatos
  createdAt: Date;
  updatedAt: Date;
  
  // Relaciones
  project: Project;
  spaceType: SpaceType;
}
```

### Entidad: SpaceType

```typescript
export class SpaceType {
  id: string;                    // UUID
  name: string;                  // "Cocina", "Baño", "Recámara"
  category: SpaceCategory;       // RESIDENTIAL, COMMERCIAL, INDUSTRIAL, etc.
  defaultCostPerM2?: number;     // Costo estimado por m² (opcional)
  description?: string;
  
  // Template/defaults
  typicalArea?: number;          // Área típica para este tipo
  
  createdAt: Date;
  updatedAt: Date;
  
  spaces: Space[];               // Relación 1:N
}

enum SpaceCategory {
  RESIDENTIAL = 'RESIDENTIAL',
  COMMERCIAL = 'COMMERCIAL',
  INDUSTRIAL = 'INDUSTRIAL',
  INSTITUTIONAL = 'INSTITUTIONAL',
  MIXED = 'MIXED'
}
```

---

## ENDPOINTS REST

### Projects

```
POST   /api/v1/projects              - Crear proyecto
GET    /api/v1/projects              - Listar proyectos (paginado)
GET    /api/v1/projects/:id          - Obtener proyecto
PUT    /api/v1/projects/:id          - Actualizar proyecto
DELETE /api/v1/projects/:id          - Eliminar proyecto
GET    /api/v1/projects/:id/spaces   - Espacios de un proyecto
```

### Spaces

```
POST   /api/v1/spaces                - Crear espacio
GET    /api/v1/spaces/:id            - Obtener espacio
PUT    /api/v1/spaces/:id            - Actualizar espacio
DELETE /api/v1/spaces/:id            - Eliminar espacio
PATCH  /api/v1/spaces/:id/area       - Actualizar área real (desde DWG)
```

### Space Types

```
GET    /api/v1/space-types           - Listar tipos (seed data)
POST   /api/v1/space-types           - Crear tipo personalizado
```

---

## VALIDACIONES

### CreateProjectDto
- `name`: requerido, 3-200 caracteres
- `client`: requerido, 2-100 caracteres
- `location`: requerido
- `startDate`: fecha válida, no en el pasado
- `estimatedEndDate`: opcional, debe ser posterior a startDate

### CreateSpaceDto
- `projectId`: UUID válido, proyecto debe existir
- `name`: requerido, 2-100 caracteres
- `spaceTypeId`: UUID válido, tipo debe existir
- `requiredArea`: número positivo, max 10,000 m²
- `quantity`: entero positivo, min 1, max 100

---

## TESTS REQUERIDOS

### Unit Tests
- ✅ Use cases (toda la lógica de negocio)
- ✅ Value objects (validaciones)
- ✅ DTOs (transformaciones)

### Integration Tests
- ✅ Controllers + DB (POST, GET, PUT, DELETE)
- ✅ Validaciones end-to-end
- ✅ Relaciones entre entidades

### Test Coverage Target
- **Mínimo 80%** de cobertura
- **100%** en domain/use-cases

---

## DOCKER COMPOSE

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: construccion_db
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  mongodb:
    image: mongo:7
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin123
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  mongo_data:
  redis_data:
```

---

## SEED DATA

Crear algunos SpaceTypes básicos para empezar:

```typescript
const seedSpaceTypes = [
  // Residencial
  { name: 'Recámara', category: 'RESIDENTIAL', typicalArea: 12 },
  { name: 'Baño', category: 'RESIDENTIAL', typicalArea: 4 },
  { name: 'Cocina', category: 'RESIDENTIAL', typicalArea: 8 },
  { name: 'Sala', category: 'RESIDENTIAL', typicalArea: 20 },
  { name: 'Comedor', category: 'RESIDENTIAL', typicalArea: 12 },
  { name: 'Estudio', category: 'RESIDENTIAL', typicalArea: 10 },
  { name: 'Lavandería', category: 'RESIDENTIAL', typicalArea: 4 },
  
  // Comercial
  { name: 'Oficina', category: 'COMMERCIAL', typicalArea: 15 },
  { name: 'Sala de Juntas', category: 'COMMERCIAL', typicalArea: 25 },
  { name: 'Recepción', category: 'COMMERCIAL', typicalArea: 20 },
  { name: 'Almacén', category: 'COMMERCIAL', typicalArea: 30 },
];
```

---

## DEPENDENCIAS PRINCIPALES

```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/typeorm": "^10.0.0",
    "typeorm": "^0.3.17",
    "pg": "^8.11.3",
    "class-validator": "^0.14.0",
    "class-transformer": "^0.5.1",
    "uuid": "^9.0.0"
  },
  "devDependencies": {
    "@nestjs/testing": "^10.0.0",
    "@types/jest": "^29.5.0",
    "@types/node": "^20.0.0",
    "jest": "^29.5.0",
    "ts-jest": "^29.1.0",
    "typescript": "^5.1.0",
    "prettier": "^3.0.0",
    "eslint": "^8.42.0"
  }
}
```

---

## PASO A PASO (Tu Plan)

Por favor, crea un plan detallado que cubra:

1. **Setup del monorepo**
   - Inicializar Turborepo
   - Configurar workspaces
   - Setup de packages compartidos (types, config)

2. **Configuración base**
   - TypeScript config (strict mode)
   - ESLint + Prettier
   - Jest config

3. **Docker Compose**
   - PostgreSQL + MongoDB + Redis
   - Scripts de inicialización

4. **Microservicio Programa**
   - Estructura de carpetas (Clean Architecture)
   - Entidades con TypeORM
   - Repositories
   - Use Cases
   - DTOs con validaciones
   - Controllers
   - Exception filters
   - Swagger documentation

5. **Tests**
   - Unit tests para use cases
   - Integration tests para controllers
   - Setup de test database

6. **Seed data**
   - Script para poblar SpaceTypes

7. **Documentación**
   - README con instrucciones
   - API documentation (Swagger)
   - CHANGELOG

8. **Git**
   - Commits atómicos
   - PR con descripción completa

---

## 🎯 TU TURNO, CLAUDE

**Ahora, por favor:**

1. ✅ **LEE** el archivo `CLAUDE.md`
2. ✅ **CREA** un plan detallado siguiendo los pasos de arriba
3. ✅ **MUÉSTRAME** el plan y espera mi aprobación
4. ❌ **NO CODEES** hasta que yo diga "adelante"

Una vez que apruebe el plan, procede con la implementación paso a paso, haciendo commits frecuentes.

¡Empecemos! 🚀
