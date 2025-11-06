# Schedule Service - Servicio de Programación de Obras

Microservicio para gestión de cronogramas de construcción con **CPM (Critical Path Method)** y generación de datos para Diagramas de Gantt.

## 🎯 Características Principales

- ✅ **Cálculo de Ruta Crítica (CPM)** - Método del Camino Crítico completo
- ✅ **Gestión de Cronogramas** - CRUD completo de proyectos de construcción
- ✅ **Actividades y Dependencias** - Soporte para múltiples tipos de relaciones
- ✅ **Cálculo de Holguras** - Total Float y Free Float
- ✅ **Datos para Gantt** - Generación de estructura para visualización
- ✅ **Asignación de Recursos** - Vinculación de personal/equipo a actividades
- ✅ **Integración con Espacios** - Conexión con el "Objeto Génesis" (Espacio_ID)
- ✅ **Integración con Presupuesto** - Vinculación con partidas presupuestarias

## 📐 ¿Qué es CPM (Critical Path Method)?

El **Método del Camino Crítico (CPM)** es una técnica de análisis de redes para la planificación y gestión de proyectos. Identifica:

1. **La ruta crítica**: Secuencia de actividades que determina la duración mínima del proyecto
2. **Actividades críticas**: Actividades sin holgura que no pueden retrasarse sin afectar el proyecto
3. **Holguras**: Tiempo que puede retrasarse una actividad sin afectar el proyecto

### Conceptos Clave

- **ES (Early Start)**: Fecha más temprana en que puede iniciar una actividad
- **EF (Early Finish)**: Fecha más temprana en que puede terminar una actividad
- **LS (Late Start)**: Fecha más tardía en que puede iniciar sin retrasar el proyecto
- **LF (Late Finish)**: Fecha más tardía en que puede terminar sin retrasar el proyecto
- **Total Float**: LS - ES (holgura total de la actividad)
- **Critical Activity**: Actividad con Total Float = 0
- **Critical Path**: Camino más largo a través de la red (determina duración del proyecto)

### Algoritmo CPM Implementado

```typescript
1. Topological Sort (Kahn's Algorithm)
   - Ordena actividades respetando dependencias
   - Detecta ciclos en la red

2. Forward Pass
   - Calcula ES y EF de cada actividad
   - ES = max(EF de predecesores + lag)
   - EF = ES + Duration

3. Backward Pass
   - Calcula LS y LF de cada actividad
   - LF = min(LS de sucesores - lag)
   - LS = LF - Duration

4. Float Calculation
   - Total Float = LS - ES
   - Free Float = min(ES de sucesores) - EF

5. Critical Path Identification
   - Actividades con Total Float = 0
   - Camino continuo desde inicio a fin
```

## 🏗️ Arquitectura

```
schedule/
├── src/
│   ├── domain/
│   │   └── entities/
│   │       ├── schedule.entity.ts          # Cronograma
│   │       ├── activity.entity.ts          # Actividad
│   │       ├── dependency.entity.ts        # Dependencia entre actividades
│   │       └── resource-assignment.entity.ts # Asignación de recursos
│   │
│   ├── application/
│   │   ├── dtos/
│   │   │   ├── create-schedule.dto.ts
│   │   │   ├── create-activity.dto.ts
│   │   │   └── create-dependency.dto.ts
│   │   │
│   │   └── use-cases/
│   │       ├── cpm-calculator.service.ts         # 🔥 Algoritmo CPM completo
│   │       ├── calculate-critical-path.use-case.ts
│   │       └── generate-gantt-data.use-case.ts
│   │
│   └── infrastructure/
│       ├── database/
│       │   └── seeds/
│       │       └── seed.ts                 # Datos de ejemplo
│       │
│       └── http/
│           └── controllers/
│               └── schedules.controller.ts  # API REST
│
├── app.module.ts
└── main.ts
```

## 🚀 Instalación y Configuración

### 1. Instalar Dependencias

```bash
cd services/schedule
npm install
```

### 2. Configurar Variables de Entorno

Crear archivo `.env`:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=schedule_db
DB_SYNC=true
DB_LOGGING=false

# Server
PORT=3005
```

### 3. Iniciar Base de Datos

```bash
# Con Docker
docker run -d \
  --name schedule-postgres \
  -e POSTGRES_DB=schedule_db \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15
```

### 4. Ejecutar Migraciones (automático con synchronize=true)

### 5. Cargar Datos de Prueba

```bash
npm run seed
```

### 6. Iniciar Servicio

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run start
```

El servicio estará disponible en: **http://localhost:3005**

Documentación Swagger: **http://localhost:3005/api/docs**

## 📡 API Endpoints

### Cronogramas

#### Crear Cronograma
```http
POST /api/v1/schedules
Content-Type: application/json

{
  "projectId": "uuid",
  "name": "Cronograma Casa Habitación",
  "description": "Descripción del proyecto",
  "startDate": "2025-01-15",
  "userId": "uuid"
}
```

#### Listar Cronogramas
```http
GET /api/v1/schedules?projectId=uuid&status=DRAFT
```

#### Obtener Cronograma
```http
GET /api/v1/schedules/:id
```

#### Actualizar Cronograma
```http
PUT /api/v1/schedules/:id
Content-Type: application/json

{
  "name": "Nuevo nombre",
  "status": "BASELINE"
}
```

#### Eliminar Cronograma
```http
DELETE /api/v1/schedules/:id
```

---

### Actividades

#### Agregar Actividad
```http
POST /api/v1/schedules/:id/activities
Content-Type: application/json

{
  "code": "ACT-001",
  "name": "Excavación de cimientos",
  "description": "Excavación manual de zanjas",
  "duration": 5,
  "spaceId": "uuid",           // Opcional - vincula al Espacio_ID
  "budgetItemId": "uuid"       // Opcional - vincula a partida presupuestal
}
```

**Nota**: `duration` está en días laborables.

#### Obtener Actividades de un Cronograma
```http
GET /api/v1/schedules/:id/activities
```

---

### Dependencias

#### Agregar Dependencia
```http
POST /api/v1/schedules/:id/dependencies
Content-Type: application/json

{
  "predecessorId": "uuid",
  "successorId": "uuid",
  "type": "FINISH_TO_START",   // FS, SS, FF, SF
  "lag": 0                      // Días de desfase (puede ser negativo)
}
```

**Tipos de Dependencia**:
- `FINISH_TO_START` (FS): La más común - el sucesor inicia cuando termina el predecesor
- `START_TO_START` (SS): Ambas actividades inician al mismo tiempo
- `FINISH_TO_FINISH` (FF): Ambas actividades terminan al mismo tiempo
- `START_TO_FINISH` (SF): Raro - el sucesor termina cuando inicia el predecesor

**Lag**:
- Positivo: Retraso (ej: curado de concreto 7 días)
- Negativo: Adelanto/superposición

#### Obtener Dependencias de un Cronograma
```http
GET /api/v1/schedules/:id/dependencies
```

---

### 🔥 CPM (Critical Path Method)

#### Calcular Ruta Crítica
```http
POST /api/v1/schedules/:id/calculate
```

**Proceso**:
1. Ejecuta algoritmo de ordenamiento topológico (Kahn)
2. Forward Pass: calcula ES y EF
3. Backward Pass: calcula LS y LF
4. Calcula Total Float y Free Float
5. Identifica actividades críticas (float = 0)
6. Construye el Critical Path
7. Actualiza Schedule con duración total y ruta crítica
8. Actualiza todas las Activities con sus valores CPM

**Respuesta**:
```json
{
  "id": "uuid",
  "name": "Cronograma Casa Habitación",
  "totalDuration": 75,
  "criticalPath": ["act-uuid-1", "act-uuid-2", ...],
  "startDate": "2025-01-15",
  "endDate": "2025-04-01",
  "status": "DRAFT"
}
```

---

### 📊 Gantt Chart Data

#### Obtener Datos para Gantt
```http
GET /api/v1/schedules/:id/gantt
```

**Respuesta**:
```json
{
  "tasks": [
    {
      "id": "uuid",
      "code": "ACT-001",
      "name": "Limpieza y trazo",
      "start": "2025-01-15",
      "end": "2025-01-17",
      "duration": 2,
      "progress": 0,
      "dependencies": [],
      "isCritical": true,
      "totalFloat": 0,
      "resources": ["Cuadrilla de limpieza"]
    },
    {
      "id": "uuid",
      "code": "ACT-002",
      "name": "Excavación para cimientos",
      "start": "2025-01-17",
      "end": "2025-01-20",
      "duration": 3,
      "progress": 0,
      "dependencies": ["uuid-act-001"],
      "isCritical": true,
      "totalFloat": 0,
      "resources": ["Operador de retroexcavadora", "Peones"]
    }
  ],
  "criticalPath": ["uuid-act-001", "uuid-act-002", ...],
  "startDate": "2025-01-15",
  "endDate": "2025-04-01",
  "totalDuration": 75
}
```

**Uso**: Esta estructura puede alimentar directamente librerías como:
- DHTMLX Gantt
- Frappe Gantt
- Google Charts Gantt
- FullCalendar Timeline

---

## 🧪 Ejemplo de Flujo Completo

### 1. Crear Cronograma

```bash
curl -X POST http://localhost:3005/api/v1/schedules \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "00000000-0000-0000-0000-000000000001",
    "name": "Casa Habitación 150m²",
    "description": "Cronograma de casa habitación",
    "startDate": "2025-02-01",
    "userId": "00000000-0000-0000-0000-000000000099"
  }'

# Respuesta: { "id": "schedule-uuid", ... }
```

### 2. Agregar Actividades

```bash
# Actividad 1: Limpieza
curl -X POST http://localhost:3005/api/v1/schedules/schedule-uuid/activities \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ACT-001",
    "name": "Limpieza del terreno",
    "duration": 2
  }'

# Respuesta: { "id": "act1-uuid", ... }

# Actividad 2: Excavación
curl -X POST http://localhost:3005/api/v1/schedules/schedule-uuid/activities \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ACT-002",
    "name": "Excavación",
    "duration": 3
  }'

# Respuesta: { "id": "act2-uuid", ... }

# Actividad 3: Cimentación
curl -X POST http://localhost:3005/api/v1/schedules/schedule-uuid/activities \
  -H "Content-Type: application/json" \
  -d '{
    "code": "ACT-003",
    "name": "Cimentación",
    "duration": 5
  }'

# Respuesta: { "id": "act3-uuid", ... }
```

### 3. Crear Dependencias

```bash
# Limpieza → Excavación (FS)
curl -X POST http://localhost:3005/api/v1/schedules/schedule-uuid/dependencies \
  -H "Content-Type: application/json" \
  -d '{
    "predecessorId": "act1-uuid",
    "successorId": "act2-uuid",
    "type": "FINISH_TO_START",
    "lag": 0
  }'

# Excavación → Cimentación (FS con 1 día de lag para inspección)
curl -X POST http://localhost:3005/api/v1/schedules/schedule-uuid/dependencies \
  -H "Content-Type: application/json" \
  -d '{
    "predecessorId": "act2-uuid",
    "successorId": "act3-uuid",
    "type": "FINISH_TO_START",
    "lag": 1
  }'
```

### 4. Calcular CPM

```bash
curl -X POST http://localhost:3005/api/v1/schedules/schedule-uuid/calculate

# Respuesta:
{
  "id": "schedule-uuid",
  "totalDuration": 11,
  "criticalPath": ["act1-uuid", "act2-uuid", "act3-uuid"],
  "startDate": "2025-02-01",
  "endDate": "2025-02-12"
}
```

### 5. Obtener Datos para Gantt

```bash
curl http://localhost:3005/api/v1/schedules/schedule-uuid/gantt

# Respuesta con todos los datos formateados para Gantt
```

---

## 🔗 Integración con Otros Servicios

### 1. Integración con Programa Service (Espacio_ID)

```typescript
// Al crear actividad, vincular al espacio del Programa Arquitectónico
POST /api/v1/schedules/:id/activities
{
  "code": "ACT-010",
  "name": "Muros de cocina",
  "duration": 3,
  "spaceId": "kitchen-space-uuid"  // 👈 Vincula al Espacio_ID
}
```

**Beneficio**: Trazabilidad completa. Puedes ver qué actividades afectan a qué espacio.

### 2. Integración con Cost Engine (BudgetItem)

```typescript
// Vincular actividad a partida presupuestal
POST /api/v1/schedules/:id/activities
{
  "code": "ACT-020",
  "name": "Instalación eléctrica",
  "duration": 5,
  "budgetItemId": "budget-item-uuid"  // 👈 Vincula a partida del presupuesto
}
```

**Beneficio**:
- Costo planificado vs costo real
- Flujo de caja proyectado
- Curva S (avance físico vs financiero)

### 3. Integración con Execution Service (Móvil)

El Execution Service puede:
- Actualizar `percentComplete` de actividades en campo
- Reportar inicio/fin real de actividades
- Actualizar asignación de recursos
- Comparar planificado vs real

---

## 📊 Modelo de Datos

### Schedule (Cronograma)
```typescript
{
  id: string (UUID)
  projectId: string (UUID)          // Referencia a Project
  name: string
  description: string
  startDate: Date
  endDate: Date                     // Calculado por CPM
  status: ScheduleStatus            // DRAFT | BASELINE | IN_PROGRESS | COMPLETED
  totalDuration: number             // Días totales (calculado por CPM)
  criticalPath: string[]            // Array de Activity IDs en ruta crítica
  createdBy: string (UUID)
  createdAt: Date
  updatedAt: Date
  activities: Activity[]
}
```

### Activity (Actividad)
```typescript
{
  id: string (UUID)
  scheduleId: string (UUID)
  code: string                      // "ACT-001"
  name: string
  description: string
  duration: number                  // Días laborables

  // CPM Calculations
  earlyStart: number                // ES (calculado)
  earlyFinish: number               // EF (calculado)
  lateStart: number                 // LS (calculado)
  lateFinish: number                // LF (calculado)
  totalFloat: number                // Holgura total (calculado)
  freeFloat: number                 // Holgura libre (calculado)
  isCritical: boolean               // true si totalFloat = 0

  // Progress
  percentComplete: number           // 0-100
  actualStart: Date | null
  actualFinish: Date | null

  // Integration
  spaceId: string (UUID) | null     // 👈 Objeto Génesis
  budgetItemId: string (UUID) | null

  // Relations
  predecessors: Dependency[]
  successors: Dependency[]
  resourceAssignments: ResourceAssignment[]
}
```

### Dependency (Dependencia)
```typescript
{
  id: string (UUID)
  predecessorId: string (UUID)
  successorId: string (UUID)
  type: DependencyType              // FS | SS | FF | SF
  lag: number                       // Días de desfase (+/-)

  predecessor: Activity
  successor: Activity
}
```

### ResourceAssignment (Asignación de Recurso)
```typescript
{
  id: string (UUID)
  activityId: string (UUID)
  resourceName: string              // "Albañil", "Electricista"
  quantity: number                  // Cantidad de recursos

  activity: Activity
}
```

---

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:cov
```

### Ejemplo de Test CPM

```typescript
describe('CPMCalculator', () => {
  it('should calculate critical path correctly', () => {
    const activities = [
      { id: '1', duration: 5 },
      { id: '2', duration: 3 },
      { id: '3', duration: 7 },
    ];

    const dependencies = [
      { predecessorId: '1', successorId: '2' },
      { predecessorId: '1', successorId: '3' },
    ];

    const result = calculator.calculate(activities, dependencies);

    expect(result.totalDuration).toBe(12);  // 5 + 7
    expect(result.criticalPath).toEqual(['1', '3']);
    expect(activities[2].isCritical).toBe(true);
    expect(activities[1].totalFloat).toBe(4);  // 12 - 5 - 3
  });
});
```

---

## 🎓 Conceptos Avanzados

### 1. Actividades con Múltiples Predecesores

```
    A (3 días) ──┐
                 ├──→ C (5 días)
    B (2 días) ──┘
```

CPM calcula:
- ES(C) = max(EF(A), EF(B)) = max(3, 2) = 3
- C puede iniciar solo cuando AMBOS predecesores terminen

### 2. Lag Positivo vs Negativo

**Lag Positivo** (retraso obligatorio):
```
Colado de concreto → [+7 días de curado] → Descimbrado
```

**Lag Negativo** (adelanto/superposición):
```
Diseño (10 días) → [-3 días] → Desarrollo (inicia 3 días antes de que termine diseño)
```

### 3. Fast-Tracking vs Crashing

**Fast-Tracking**: Ejecutar actividades en paralelo que normalmente serían secuenciales
```
Antes: A → B → C (secuencial)
Después: A → B
         A → C  (B y C en paralelo)
```

**Crashing**: Agregar recursos para reducir duración
```
Actividad: 10 días con 2 albañiles
Crashing: 7 días con 4 albañiles (más costo)
```

---

## 📈 Casos de Uso Reales

### 1. Análisis "What-If"

```typescript
// ¿Qué pasa si la actividad X se retrasa 3 días?
PUT /api/v1/schedules/:id/activities/:activityId
{
  "duration": 8  // era 5, ahora 8
}

POST /api/v1/schedules/:id/calculate

// Ver impacto en proyecto total y ruta crítica
```

### 2. Resource Leveling

```typescript
// Identificar actividades con recursos compartidos
GET /api/v1/schedules/:id/activities

// Filtrar actividades no críticas con holgura
activities.filter(a => a.totalFloat > 0)

// Retrasar actividades no críticas para nivelar recursos
```

### 3. Compresión de Cronograma

```typescript
// Identificar actividades críticas
activities.filter(a => a.isCritical)

// Reducir duración de actividades críticas (crashing)
// O ejecutar en paralelo (fast-tracking)
```

---

## 🔧 Configuración de Producción

### Docker

```dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3005

CMD ["node", "dist/main"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  schedule-service:
    build: ./services/schedule
    ports:
      - "3005:3005"
    environment:
      DB_HOST: schedule-db
      DB_PORT: 5432
      DB_USERNAME: postgres
      DB_PASSWORD: postgres
      DB_DATABASE: schedule_db
    depends_on:
      - schedule-db

  schedule-db:
    image: postgres:15
    environment:
      POSTGRES_DB: schedule_db
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - schedule-data:/var/lib/postgresql/data

volumes:
  schedule-data:
```

---

## 📚 Referencias

### Bibliografía CPM
- "Project Management: A Systems Approach to Planning, Scheduling, and Controlling" - Harold Kerzner
- "A Guide to the Project Management Body of Knowledge (PMBOK Guide)" - PMI
- "Construction Planning, Equipment, and Methods" - Robert Peurifoy

### Algoritmos
- **Topological Sort**: Kahn's Algorithm (1962)
- **CPM**: DuPont & Remington Rand (1957)
- **PERT**: US Navy (1958)

### Herramientas Relacionadas
- Microsoft Project
- Primavera P6
- DHTMLX Gantt
- GanttProject

---

## 🤝 Contribución

Este servicio forma parte del **Sistema Integral de Gestión de Construcción**.

Para contribuir:
1. Seguir Clean Architecture
2. Mantener cobertura de tests > 80%
3. Documentar endpoints en Swagger
4. Seguir convenciones de commits: `feat(schedule): add resource optimization`

---

## 📄 Licencia

Propietario: Sistema Integral de Gestión de Construcción

---

## 🆘 Soporte

Para reportar bugs o solicitar features:
- Crear issue en el repositorio
- Contactar al equipo de desarrollo

---

**Versión**: 1.0.0
**Última actualización**: Enero 2025
**Autor**: Claude Code - Session 6
