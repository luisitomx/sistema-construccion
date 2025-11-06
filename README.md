# Sistema Integral de Gestión de Construcción

Plataforma unificada que conecta **diseño, costos, programación y ejecución** mediante un modelo de datos centralizado basado en el **Programa Arquitectónico como "Objeto Génesis"**.

## Visión del Proyecto

- **Problema**: Fragmentación de datos entre diseño, costos y ejecución
- **Solución**: Sistema unificado desde el día 0 con trazabilidad completa basada en `Espacio_ID`
- **Diferenciador**: Pre-emptor de herramientas tradicionales, respuesta en tiempo real a cambios de diseño

## El "Objeto Génesis" (Espacio_ID)

Cada espacio arquitectónico tiene un **ID único que se propaga por todos los módulos**:

```
┌─────────────────┐
│ Programa Arq.   │  → Crea Espacio_ID
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Diseño CAD/BIM  │  → Vincula DWG al Espacio_ID
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Costos          │  → Calcula presupuesto por Espacio_ID
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Programación    │  → Cronograma por Espacio_ID
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Ejecución       │  → Avance real por Espacio_ID
└─────────────────┘
```

## Quick Start

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd sistema-construccion
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Levantar Infraestructura (Docker)

```bash
npm run infra:up
```

Esto levanta:
- PostgreSQL (Puerto 5432)
- MongoDB (Puerto 27017)
- Redis (Puerto 6379)
- pgAdmin (Puerto 5050)

### 4. Seed de Datos

```bash
cd services/programa
npm run seed
```

### 5. Ejecutar Microservicio

```bash
cd services/programa
npm run dev
```

### 6. Ver Documentación

Abrir en el navegador:
- **Swagger API**: http://localhost:3001/api/docs

## Estructura del Monorepo

```
sistema-construccion/
├── apps/
│   ├── web/              # Next.js web app (Futuro)
│   ├── mobile/           # React Native app (Futuro)
│   └── api-gateway/      # GraphQL gateway (Futuro)
├── services/
│   ├── programa/         # ✅ Microservicio Programa (IMPLEMENTADO)
│   ├── auth/             # Auth service (Futuro)
│   ├── design/           # Design service (Futuro)
│   ├── costs/            # Cost engine (Futuro)
│   ├── schedule/         # Schedule service (Futuro)
│   ├── execution/        # Execution service (Futuro)
│   └── payroll/          # Payroll service (Futuro)
├── packages/
│   ├── types/            # ✅ Tipos TypeScript compartidos
│   ├── config/           # ✅ Configuraciones (TS, ESLint, Prettier)
│   └── utils/            # ✅ Utilidades compartidas
├── infra/
│   └── docker/           # ✅ Docker Compose files
└── docs/
    └── arquitectura/     # Documentación técnica
```

## Estado Actual

### ✅ Fase 1 Completada - MVP Core

- [x] Setup del monorepo con Turborepo
- [x] Packages compartidos (types, config, utils)
- [x] Docker Compose (PostgreSQL, MongoDB, Redis)
- [x] **Microservicio Programa Arquitectónico** completo
  - [x] Clean Architecture
  - [x] CRUD de Projects
  - [x] CRUD de Spaces (Espacio_ID)
  - [x] Tipos de espacios (seed data)
  - [x] Swagger documentation
  - [x] Tests unitarios

### 🔄 Fase 2 En Progreso - Auth & Gateway

- [x] **Auth Service** - Fundación implementada
  - [x] Domain Layer (User, Role, Permission, RefreshToken)
  - [x] Value Objects (Email)
  - [x] Repository Interfaces
  - [x] DTO base (RegisterDto)
  - [ ] Use Cases (Register, Login, Refresh, Logout)
  - [ ] JWT Service
  - [ ] Password Service
  - [ ] Controllers y Guards
  - [ ] Seed data (roles y admin)

- [ ] **API Gateway GraphQL**
  - [ ] GraphQL schema
  - [ ] Resolvers
  - [ ] Service clients
  - [ ] Authentication

- [ ] Web Frontend (Next.js)

### 📋 Pendiente

- [ ] Design Service (DWG/BIM integration)
- [ ] Cost Engine
- [ ] Schedule Service
- [ ] Mobile App
- [ ] Execution Service
- [ ] Payroll Service

## Stack Tecnológico

### Backend
- **Runtime**: Node.js 20+ LTS
- **Framework**: NestJS 10+ con TypeScript 5+
- **ORM**: TypeORM para PostgreSQL
- **Base de Datos**: PostgreSQL 16, MongoDB 7, Redis 7
- **Containerización**: Docker + Docker Compose
- **API**: REST + Swagger (GraphQL próximamente)

### Frontend (Futuro)
- **Framework**: Next.js 14+ (App Router)
- **UI**: React 18+ con TailwindCSS
- **Mobile**: React Native con Expo

## Comandos Principales

### Infraestructura

```bash
npm run infra:up       # Levantar servicios Docker
npm run infra:down     # Detener servicios
npm run infra:logs     # Ver logs
npm run infra:reset    # Reset completo (elimina datos)
```

### Desarrollo

```bash
npm install            # Instalar dependencias
npm run dev            # Ejecutar en desarrollo
npm run build          # Build de todos los packages/services
npm run test           # Ejecutar tests
npm run lint           # Lint con ESLint
```

### Microservicio Programa

```bash
cd services/programa
npm run dev            # Desarrollo con hot-reload
npm run build          # Compilar
npm run test           # Tests
npm run seed           # Seed de datos
```

## Documentación

### General
- **Estándares del Proyecto**: `CLAUDE.md` - Convenciones y principios
- **Arquitectura Visual**: `arquitectura-construccion.jsx` - Visualización interactiva
- **CHANGELOG**: `CHANGELOG.md` - Historial de versiones

### Microservicios
- **Programa Service**: `services/programa/README.md` - ✅ COMPLETO
- **Auth Service**: `services/auth/README.md` - ⏳ FUNDACIÓN (35%)

### Infraestructura
- **Docker Compose**: `infra/docker/README.md` - Setup de servicios

### Guías de Sesiones
- **Sesión 2 - Resumen**: `docs/SESION_2_RESUMEN.md` - Estado actual y logros
- **Sesión 3 - Roadmap**: `docs/SESION_3_ROADMAP.md` - Plan detallado próximos pasos

## Próximos Pasos

1. **Fase 1 (Actual)**: Completar Auth Service y API Gateway
2. **Fase 2**: Web Frontend básico para gestión de proyectos
3. **Fase 3**: Design Service con integración DWG
4. **Fase 4**: Cost Engine y Schedule Service
5. **Fase 5**: Mobile App offline-first

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│              Capa de Presentación                        │
│  Web App │ Mobile App │ Desktop │ API Gateway            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              Capa de Servicios                           │
│  Auth │ Notifications │ File Storage │ ML/Analytics      │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│           Microservicios Core                            │
│  Programa │ Design │ Costs │ Schedule │ Execution        │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│              Capa de Datos                               │
│  PostgreSQL │ MongoDB │ Redis │ ElasticSearch            │
└─────────────────────────────────────────────────────────┘
```

## Contribuir

1. Lee `CLAUDE.md` para entender los estándares del proyecto
2. Crea una branch: `feature/nombre-funcionalidad`
3. Sigue Clean Architecture en todos los microservicios
4. Escribe tests (coverage mínimo 80%)
5. Crea un PR con descripción detallada

## Licencia

GNU AFFERO GENERAL PUBLIC LICENSE Version 3

---

**Versión**: 0.1.0
**Estado**: MVP - Fase 1 en Desarrollo
**Última Actualización**: 2025-11-05
