# Sistema Integral de Gestión de Construcción

## Visión del Proyecto
Plataforma integral que unifica diseño, costos, programación y ejecución mediante un modelo de datos centralizado basado en el **Programa Arquitectónico como "Objeto Génesis"**.

### Propuesta de Valor Única
- **Problema**: Fragmentación de datos entre diseño, costos y ejecución
- **Solución**: Sistema unificado desde el día 0 con trazabilidad completa basada en Espacio_ID
- **Diferenciador**: Pre-emptor de herramientas tradicionales, respuesta en tiempo real a cambios de diseño

---

## Arquitectura del Sistema

### Arquitectura en Capas

#### 1. Capa de Presentación
- Web App: React 18 + Next.js 14 + TypeScript + TailwindCSS
- Mobile App: React Native + Expo (offline-first)
- Desktop: Electron (opcional)
- API Gateway: GraphQL

#### 2. Capa de Servicios
- Auth Service (JWT + OAuth2)
- Notification Service (WebSockets + Push)
- File Storage Service (S3-compatible)
- ML/Analytics Service (Python)

#### 3. Microservicios Core
- **Programa Service**: El núcleo - gestión del Programa Arquitectónico
- **Design Service**: Integración DWG/BIM (ODA SDK + Autodesk APS)
- **Cost Engine**: Explosión de insumos y presupuestos (BDPU/BDAU)
- **Schedule Service**: Gantt avanzado con camino crítico (DHTMLX)
- **Execution Service**: App móvil para campo
- **Payroll Service**: Gestión de nóminas de construcción

#### 4. Capa de Datos
- PostgreSQL: Base de datos principal (Core data)
- MongoDB: Documentos y logs
- Redis: Cache y sesiones
- ElasticSearch: Búsqueda full-text

---

## Stack Tecnológico

### Backend
- **Runtime**: Node.js 20+ LTS
- **Framework**: NestJS 10+ con TypeScript 5+
- **ORM**: TypeORM para PostgreSQL, Mongoose para MongoDB
- **Messaging**: RabbitMQ o Kafka para eventos
- **Containerización**: Docker + Kubernetes
- **API**: GraphQL (Apollo Server) + REST (NestJS)
- **ML/Analytics**: Python 3.11+ con FastAPI

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+ con TypeScript
- **Styling**: TailwindCSS 3+
- **State Management**: Redux Toolkit o Zustand
- **3D Visualization**: Three.js
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query (React Query)

### Mobile
- **Framework**: React Native con Expo
- **Offline Support**: WatermelonDB o SQLite
- **Navigation**: React Navigation
- **Sync**: Background tasks para sincronización

---

## Principios de Arquitectura

### 1. El "Objeto Génesis" (Espacio_ID)
- **Cada espacio** tiene un ID único que se propaga por todos los módulos
- **Flujo de datos**:
  1. Programa Arquitectónico → Define espacios con área requerida → Crea Espacio_ID
  2. Diseño CAD → Vincula polilíneas DWG al Espacio_ID → Área real calculada
  3. Costos/Cronograma/Ejecución → Toda data vinculada al mismo Espacio_ID
- **Ventaja**: Trazabilidad completa, impacto en tiempo real de cambios

### 2. Clean Architecture / Arquitectura Hexagonal
```
src/
├── domain/          # Entidades, value objects, reglas de negocio
├── application/     # Use cases, DTOs, interfaces
├── infrastructure/  # Implementaciones (DB, API, externos)
└── presentation/    # Controllers, resolvers, middlewares
```

### 3. Microservicios con Event-Driven
- Comunicación asíncrona vía eventos (RabbitMQ/Kafka)
- Cada microservicio tiene su propia BD
- Patrón Saga para transacciones distribuidas
- CQRS cuando sea necesario

### 4. Offline-First para Mobile
- App móvil funciona completamente sin internet
- Sincronización inteligente cuando hay conexión
- Resolución de conflictos automática

---

## Estándares de Código

### TypeScript
```typescript
// ✅ HACER
interface Space {
  id: string;
  name: string;
  type: SpaceType;
  requiredArea: number;
  realArea?: number;
}

// ❌ NO HACER
const space = {
  id: "123",
  name: "Cocina",
  // sin tipos explícitos
}
```

### Nombres de Archivos
- **Entidades**: `space.entity.ts`, `project.entity.ts`
- **DTOs**: `create-space.dto.ts`, `update-space.dto.ts`
- **Use Cases**: `create-space.use-case.ts`
- **Controllers**: `spaces.controller.ts`
- **Services**: `spaces.service.ts`
- **Tests**: `spaces.service.spec.ts`

### Commits
- Formato: `<tipo>(<alcance>): <descripción>`
- Tipos: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- Ejemplos:
  - `feat(programa): add space creation endpoint`
  - `fix(costos): correct budget calculation for overtime`
  - `refactor(design): improve DWG parsing performance`

### Testing
- **Coverage mínimo**: 80%
- **Unit tests**: Para toda lógica de negocio
- **Integration tests**: Para endpoints y DB
- **E2E tests**: Para flujos críticos
- Usar Jest + Supertest (backend), Jest + React Testing Library (frontend)

---

## Estructura de Monorepo (Turborepo)

```
proyecto-construccion/
├── apps/
│   ├── web/              # Next.js web app
│   ├── mobile/           # React Native app
│   └── api-gateway/      # GraphQL gateway
├── services/
│   ├── programa/         # Microservicio Programa Arquitectónico
│   ├── design/           # Microservicio Diseño
│   ├── costs/            # Microservicio Costos
│   ├── schedule/         # Microservicio Programación
│   ├── execution/        # Microservicio Ejecución
│   └── payroll/          # Microservicio Nóminas
├── packages/
│   ├── ui/               # Componentes compartidos
│   ├── types/            # Tipos TypeScript compartidos
│   ├── utils/            # Utilidades compartidas
│   └── config/           # Configuraciones compartidas
├── infra/
│   ├── docker/           # Dockerfiles
│   └── k8s/              # Manifiestos Kubernetes
└── docs/
    └── arquitectura/     # Documentación técnica
```

---

## Workflow de Desarrollo

### Antes de Codear
1. **Crear branch**: `feature/modulo-funcionalidad`
2. **Crear plan**: Pedir a Claude que cree un plan detallado
3. **Revisión**: Aprobar el plan antes de implementar
4. **TDD**: Escribir tests primero cuando sea posible

### Durante Desarrollo
1. **Commits frecuentes**: Pequeños y atómicos
2. **Tests**: Ejecutar tests localmente antes de commit
3. **Lint**: Asegurar que pasa ESLint y Prettier
4. **Documentación**: Actualizar docs cuando sea necesario

### Antes de PR
1. **Self-review**: Revisar todos los cambios
2. **Tests passing**: Todos los tests en verde
3. **Coverage**: Mantener o mejorar coverage
4. **Docs actualizados**: README, CHANGELOG, etc.

### Pull Request
1. **Descripción clara**: Qué, por qué, cómo
2. **Screenshots/Videos**: Si hay cambios visuales
3. **Breaking changes**: Documentar si aplica
4. **Checklist**: Usar template de PR

---

## Módulos del Sistema (Orden de Implementación)

### Fase 1: MVP - Core (2-3 meses)
1. **Programa Arquitectónico** (2 semanas)
   - CRUD de proyectos, espacios, tipos de espacio
   - Wizard de creación
   - Validaciones básicas
   
2. **Auth & Users** (1 semana)
   - Sistema de autenticación
   - Roles y permisos
   
3. **API Gateway** (1 semana)
   - GraphQL gateway
   - Unificación de APIs

4. **Web Frontend - Básico** (3 semanas)
   - Dashboard principal
   - Gestión de proyectos
   - Gestión de espacios
   - UI responsive

5. **Design Service - Básico** (2 semanas)
   - Parser de DWG simple
   - Visualización 2D
   - Vinculación manual espacio-polilínea

### Fase 2: Funcionalidad Completa (3-4 meses)
6. **Cost Engine** (3 semanas)
7. **Schedule Service** (3 semanas)
8. **Mobile App** (4 semanas)
9. **Execution Service** (2 semanas)

### Fase 3: Avanzado (2-3 meses)
10. **ML/AI Features** (4 semanas)
11. **Payroll Service** (2 semanas)
12. **BI/Analytics** (3 semanas)

---

## Referencias y Recursos

### Documentación
- `/docs/arquitectura.md`: Arquitectura detallada
- `/docs/modelo-datos.md`: Modelo de datos completo
- `/docs/api.md`: Documentación de APIs

### Ejemplos
- Ver `/examples` para código de ejemplo
- Consultar tests para uso de APIs

### Comandos Útiles
```bash
# Instalar dependencias
npm install

# Desarrollo local
npm run dev

# Tests
npm run test
npm run test:watch
npm run test:cov

# Lint
npm run lint
npm run lint:fix

# Build
npm run build

# Docker
docker-compose up -d
```

---

## Notas Importantes para Claude

### Cuando Implementes Features:
1. **Siempre pregunta primero** si no está claro el alcance
2. **Crea un plan** antes de codear
3. **Usa tipos estrictos** de TypeScript
4. **Escribe tests** para nueva funcionalidad
5. **Documenta** interfaces y clases complejas
6. **Sigue Clean Architecture** en todos los microservicios

### Cuando Debuggees:
1. **Lee los tests** para entender comportamiento esperado
2. **Revisa logs** antes de hacer cambios
3. **Añade tests** que reproduzcan el bug
4. **Verifica** que el fix no rompe otras cosas

### Cuando Refactorices:
1. **Tests primero**: Asegura que hay cobertura
2. **Pequeños pasos**: Refactors incrementales
3. **Tests durante**: Ejecuta tests después de cada cambio
4. **Documentación**: Actualiza si cambian interfaces

---

## Glosario del Dominio

- **Programa Arquitectónico**: Documento que lista espacios requeridos con sus áreas
- **Espacio_ID**: Identificador único del "Objeto Génesis" que conecta todos los módulos
- **BDPU**: Base de Datos de Precios Unitarios
- **BDAU**: Base de Datos de Análisis Unitarios  
- **Explosión de Insumos**: Proceso de desglosar conceptos en materiales/mano de obra
- **Camino Crítico**: Secuencia de actividades que determinan duración del proyecto
- **Offline-First**: Arquitectura que funciona sin conexión y sincroniza después

---

## Seguridad

- Nunca commitear secretos o API keys
- Usar variables de entorno para configuración
- Sanitizar inputs de usuario
- Implementar rate limiting en APIs
- Logs: No incluir datos sensibles
- HTTPS obligatorio en producción
- Encriptación de datos sensibles (AES-256)

---

## Performance

- Implementar paginación en listados largos
- Usar índices en BD apropiadamente
- Cache con Redis para queries frecuentes
- Lazy loading de módulos en frontend
- Optimizar bundle size
- Implementar CDN para assets estáticos
- Cálculo incremental en Cost Engine (no full recalc)
