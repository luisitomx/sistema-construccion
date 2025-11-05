# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-11-05

### Added - Fase 1: MVP Core

#### Infrastructure
- **Monorepo Setup**: Configuración completa con Turborepo
- **Docker Compose**: PostgreSQL 16, MongoDB 7, Redis 7, pgAdmin
- **Scripts de Infraestructura**:
  - `npm run infra:up` - Levantar servicios
  - `npm run infra:down` - Detener servicios
  - `npm run infra:logs` - Ver logs
  - `npm run infra:reset` - Reset completo

#### Packages Compartidos

##### @construccion/types
- Enums: `ProjectStatus`, `SpaceCategory`
- Interfaces base: `BaseEntity`, `IProject`, `ISpace`, `ISpaceType`
- Tipos de paginación: `PaginationParams`, `PaginationResponse`
- Wrappers de respuesta: `ApiResponse<T>`

##### @construccion/config
- TypeScript strict mode configuration
- ESLint preset con reglas del proyecto
- Prettier configuration
- Jest base configuration con 80% coverage threshold

##### @construccion/utils
- `UuidHelper`: Generación y validación de UUIDs
- `DateHelper`: Utilidades de fechas
- `NumberHelper`: Operaciones numéricas
- `StringHelper`: Manipulación de strings
- `ErrorHelper`: Manejo estandarizado de errores
- `AreaValidator`: Validación de áreas (0.01 - 10,000 m²)
- `QuantityValidator`: Validación de cantidades (1 - 100)
- `StringLengthValidator`: Validación de longitud de strings

#### Microservicio Programa Arquitectónico

##### Domain Layer (Capa de Dominio)
- **Entidades**:
  - `Project`: Proyectos de construcción
  - `Space`: El "Objeto Génesis" con Espacio_ID
  - `SpaceType`: Tipos de espacios predefinidos
- **Value Objects**:
  - `Area`: Valor de área con validaciones de negocio
- **Repository Interfaces**:
  - `IProjectRepository`: CRUD + validaciones de proyectos
  - `ISpaceRepository`: CRUD + actualización de área real

##### Application Layer (Capa de Aplicación)
- **DTOs con Validaciones**:
  - `CreateProjectDto`: Validaciones de proyecto
  - `UpdateProjectDto`: Actualización parcial
  - `CreateSpaceDto`: Validaciones de espacio
  - `UpdateSpaceDto`: Actualización parcial
  - `UpdateSpaceAreaDto`: Actualización de área real desde DWG

- **Use Cases - Projects**:
  - `CreateProjectUseCase`: Crear proyecto con validación de fechas
  - `GetProjectUseCase`: Obtener proyecto por ID
  - `GetAllProjectsUseCase`: Listar con paginación
  - `UpdateProjectUseCase`: Actualizar proyecto
  - `DeleteProjectUseCase`: Eliminar (valida que no tenga espacios)

- **Use Cases - Spaces**:
  - `CreateSpaceUseCase`: Crear espacio (genera Espacio_ID)
  - `GetSpacesByProjectUseCase`: Espacios de un proyecto
  - `UpdateSpaceUseCase`: Actualizar espacio
  - `UpdateSpaceRealAreaUseCase`: Actualizar área desde DWG
  - `DeleteSpaceUseCase`: Eliminar espacio

##### Infrastructure Layer (Capa de Infraestructura)
- **TypeORM Configuration**: Conexión a PostgreSQL
- **Repositories**:
  - `ProjectRepository`: Implementación con TypeORM
  - `SpaceRepository`: Implementación con TypeORM
- **HTTP Controllers**:
  - `ProjectsController`: 6 endpoints REST
  - `SpacesController`: 5 endpoints REST
  - `SpaceTypesController`: 1 endpoint REST
- **Middlewares**:
  - `LoggerMiddleware`: Logging de requests/responses con performance tracking
- **Filters**:
  - `HttpExceptionFilter`: Manejo global de excepciones con formato consistente

##### Presentation Layer (Capa de Presentación)
- **Main Application**: Bootstrap con configuración completa
- **Swagger Documentation**: OpenAPI completa en `/api/docs`
- **Global Validation Pipe**: Validación automática de DTOs
- **Global Exception Filter**: Respuestas de error estandarizadas
- **CORS**: Habilitado para desarrollo

##### Database Seeds
- **Seed de SpaceTypes**: 11 tipos de espacios predefinidos
  - Residenciales: Recámara, Baño, Cocina, Sala, Comedor, Estudio, Lavandería
  - Comerciales: Oficina, Sala de Juntas, Recepción, Almacén
- Script: `npm run seed` (idempotente)

##### Testing
- **Unit Tests**: Test ejemplar para `CreateProjectUseCase`
- **Test Configuration**: Jest configurado con 80% coverage threshold
- **Scripts**: `test`, `test:watch`, `test:cov`

#### Documentation
- **README Principal**: Guía completa del proyecto
- **README Microservicio**: Documentación detallada del servicio Programa
- **Docker README**: Instrucciones de infraestructura
- **Swagger**: Documentación automática de API en `/api/docs`
- **CHANGELOG**: Este archivo
- **CLAUDE.md**: Estándares y convenciones del proyecto

### API Endpoints

#### Projects
```
POST   /api/v1/projects              - Crear proyecto
GET    /api/v1/projects              - Listar proyectos (paginado)
GET    /api/v1/projects/:id          - Obtener proyecto
PUT    /api/v1/projects/:id          - Actualizar proyecto
DELETE /api/v1/projects/:id          - Eliminar proyecto
GET    /api/v1/projects/:id/spaces   - Espacios del proyecto
```

#### Spaces
```
POST   /api/v1/spaces                - Crear espacio (genera Espacio_ID)
GET    /api/v1/spaces/:id            - Obtener espacio
PUT    /api/v1/spaces/:id            - Actualizar espacio
PATCH  /api/v1/spaces/:id/area       - Actualizar área real (desde DWG)
DELETE /api/v1/spaces/:id            - Eliminar espacio
```

#### Space Types
```
GET    /api/v1/space-types           - Listar tipos de espacios
```

### Business Rules Implemented

#### Projects
- ✅ Start date cannot be in the past
- ✅ Estimated end date must be after start date
- ✅ Cannot delete project with associated spaces

#### Spaces
- ✅ Required area must be between 0.01 and 10,000 m²
- ✅ Quantity must be integer between 1 and 100
- ✅ Project and SpaceType must exist before creating space
- ✅ Real area updated only from Design Service

### Technical Achievements
- ✅ Clean Architecture / Hexagonal Architecture
- ✅ TypeScript strict mode (100% type safety)
- ✅ Dependency Injection with NestJS
- ✅ Repository Pattern
- ✅ SOLID Principles
- ✅ OpenAPI/Swagger documentation
- ✅ Global exception handling
- ✅ Request/response logging
- ✅ DTO validation with class-validator
- ✅ Database synchronization with TypeORM
- ✅ Idempotent seed scripts
- ✅ Monorepo with workspace dependencies

### Development Tools
- Turborepo for monorepo management
- ESLint with TypeScript support
- Prettier for code formatting
- Jest for testing
- Docker Compose for local development
- TypeORM for database ORM
- NestJS for backend framework

## [Unreleased]

### Planned for Next Releases

#### Fase 1 Completion
- [ ] Auth Service (JWT + OAuth2)
- [ ] API Gateway (GraphQL)
- [ ] Web Frontend básico (Next.js)

#### Fase 2
- [ ] Design Service (DWG/BIM integration)
- [ ] Cost Engine
- [ ] Schedule Service
- [ ] Mobile App (React Native + Expo)
- [ ] Execution Service

#### Fase 3
- [ ] ML/AI Features
- [ ] Payroll Service
- [ ] BI/Analytics

---

## Version History

- **0.1.0** (2025-11-05) - Initial MVP release with Programa microservice
