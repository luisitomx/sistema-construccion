# Sesión 5: Cost Engine - Motor de Costos ✅

## 🎯 Objetivo Cumplido

Implementar microservicio completo para gestión de costos, análisis de precios unitarios (APU), presupuestos y explosión de insumos.

---

## ✅ Implementación Completada

### 1. **Domain Layer** (Entities + Value Objects)

#### Entities (7 entidades)

**Concept** (concepts table)
- code, name, unit, category (PRELIMINARES, CIMIENTOS, ESTRUCTURA, etc.)
- Relación 1-1 con UnitPriceAnalysis
- Categories: 7 tipos de partidas

**UnitPriceAnalysis** (unit_price_analyses table)
- **Components** (JSONB):
  - materials: MaterialComponent[]
  - labor: LaborComponent[]
  - equipment: EquipmentComponent[]
- **Factors**: indirectCostFactor (15%), profitFactor (10%)
- **Calculated fields**: directCost, indirectCost, profit, totalUnitPrice
- validFrom, validUntil (vigencia)

**Material** (materials table)
- code, name, unit, currentPrice, supplier
- Catálogo de materiales de construcción

**Labor** (labor table)
- code, name, category (PEON, OFICIAL, MAESTRO, INGENIERO)
- hourlyRate (tarifa por hora)
- Categorías de mano de obra

**Equipment** (equipment table)
- code, name, category, hourlyRate
- Maquinaria y herramientas

**Budget** (budgets table)
- projectId, version, name, status
- Totals: subtotal, indirectCosts, profit, total
- items: BudgetItem[]
- Versionado de presupuestos

**BudgetItem** (budget_items table)
- conceptId, spaceId (opcional), quantity
- unitPrice (del APU), subtotal
- Vinculación con espacios del "Objeto Génesis"

#### Value Objects

**Money**
- Usa Decimal.js para precisión matemática
- Operaciones: add, subtract, multiply, divide
- Conversión de monedas
- Redondeo configurable

---

### 2. **Application Layer** (Use Cases + DTOs)

#### Use Cases (3 casos de uso principales)

**CalculateUnitPriceUseCase**

Calcula el precio unitario de un concepto a partir de sus componentes:

```typescript
1. Fetch current prices (materials, labor, equipment)
2. Build components with costs:
   - Material cost = quantity × (1 + wasteFactor) × unitPrice
   - Labor cost = hours × hourlyRate
   - Equipment cost = hours × hourlyRate
3. Calculate direct cost = Σ all components
4. Calculate indirect cost = direct × indirectFactor%
5. Calculate profit = (direct + indirect) × profitFactor%
6. totalUnitPrice = direct + indirect + profit
7. Save analysis
```

Método `recalculate()` para actualizar con precios actuales.

**CalculateBudgetUseCase**

Calcula totales de presupuesto a partir de sus items:

```typescript
1. Load budget with items and APUs
2. For each item:
   - Get unit price from APU
   - Calculate subtotal = quantity × unitPrice
   - Save item
3. Calculate budget totals:
   - subtotal = Σ item subtotals
   - indirectCosts = subtotal × 0.15
   - profit = (subtotal + indirectCosts) × 0.10
   - total = subtotal + indirectCosts + profit
4. Save budget
```

Método `recalculateItem()` para cálculo incremental.

**ExplodeMaterialsUseCase**

Agrega todos los insumos necesarios para un presupuesto:

```typescript
1. Load budget with items and APUs
2. For each item:
   - For each material in APU:
     - totalQuantity = itemQty × materialQty × (1 + wastage)
     - Aggregate by materialId
   - For each labor in APU:
     - totalHours = itemQty × hours
     - Aggregate by laborId
   - For each equipment in APU:
     - totalHours = itemQty × hours
     - Aggregate by equipmentId
3. Return aggregated explosion:
   - materials[] with total quantities and costs
   - labor[] with total hours and costs
   - equipment[] with total hours and costs
   - totals breakdown
```

#### DTOs

- **CreateConceptDto**: code, name, unit, category, description
- **CreateUnitPriceAnalysisDto**: components arrays + factors + validity
  - MaterialComponentDto: materialId, quantity, wasteFactor
  - LaborComponentDto: laborId, hours, performance
  - EquipmentComponentDto: equipmentId, hours
- **CreateBudgetDto**: projectId, name, description, userId
- **CreateBudgetItemDto**: conceptId, spaceId, quantity

---

### 3. **Infrastructure Layer** (Controllers)

#### ConceptsController

**Endpoints:**
```
POST   /api/v1/concepts           - Create concept
GET    /api/v1/concepts           - List (filter by category)
GET    /api/v1/concepts/:id       - Get with APU
PUT    /api/v1/concepts/:id       - Update
DELETE /api/v1/concepts/:id       - Delete
POST   /api/v1/concepts/:id/analysis - Create APU
GET    /api/v1/concepts/:id/analysis - Get APU
```

#### BudgetsController

**Endpoints:**
```
POST   /api/v1/budgets            - Create budget
GET    /api/v1/budgets            - List (filter: projectId, status)
GET    /api/v1/budgets/:id        - Get with items
PUT    /api/v1/budgets/:id        - Update
DELETE /api/v1/budgets/:id        - Delete
POST   /api/v1/budgets/:id/items  - Add item
DELETE /api/v1/budgets/items/:id  - Remove item
POST   /api/v1/budgets/:id/calculate - Recalculate
GET    /api/v1/budgets/:id/explosion - Material explosion
```

#### ResourcesController (Materials, Labor, Equipment)

**Endpoints:**
```
POST   /api/v1/materials          - Create
GET    /api/v1/materials          - List
PUT    /api/v1/materials/:id      - Update price
POST   /api/v1/labor              - Create
GET    /api/v1/labor              - List
POST   /api/v1/equipment          - Create
GET    /api/v1/equipment          - List
```

---

### 4. **Seed Data** (Datos Iniciales)

#### 7 Materiales
```typescript
MAT-001: Cemento Portland CPC 30 ($150/ton)
MAT-002: Arena ($25/m³)
MAT-003: Grava 3/4" ($30/m³)
MAT-004: Block 15x20x40 ($8/pza)
MAT-005: Varilla 3/8" ($800/ton)
MAT-006: Alambre recocido ($1.5/kg)
MAT-007: Madera para cimbra ($45/m²)
```

#### 5 Categorías de Mano de Obra
```typescript
MO-001: Peón ($15/hr)
MO-002: Oficial Albañil ($25/hr)
MO-003: Maestro de Obra ($35/hr)
MO-004: Fierrero ($28/hr)
MO-005: Carpintero ($27/hr)
```

#### 3 Equipos
```typescript
EQ-001: Revolvedora 1 saco ($12/hr)
EQ-002: Vibrador de concreto ($8/hr)
EQ-003: Andamio tubular ($5/hr)
```

#### 6 Conceptos Base
```typescript
01.01.01: Limpieza de terreno (m²) - PRELIMINARES
02.01.01: Excavación a mano (m³) - CIMIENTOS
03.01.01: Cimbra común en muros (m²) - ESTRUCTURA
03.01.02: Concreto f'c=250 kg/cm² (m³) - ESTRUCTURA
03.02.01: Acero de refuerzo fy=4200 kg/cm² (ton) - ESTRUCTURA
04.01.01: Muro de block 15x20x40 (m²) - ALBANILERIA
```

---

## 📊 Ejemplo Completo: APU de Concreto

### Datos de Entrada

**Concepto:** Concreto f'c=250 kg/cm²

**Materiales:**
- Cemento: 0.38 ton × wastage 5% × $150 = $59.85
- Arena: 0.51 m³ × wastage 5% × $25 = $13.39
- Grava: 0.76 m³ × wastage 5% × $30 = $23.94

**Mano de Obra:**
- Oficial Albañil: 2.5 hrs × $25/hr = $62.50
- Peón: 5.0 hrs × $15/hr = $75.00

**Equipo:**
- Revolvedora: 2.0 hrs × $12/hr = $24.00
- Vibrador: 1.5 hrs × $8/hr = $12.00

### Cálculo

```
Costo Directo:
  Materiales:  $97.18
  Mano Obra:   $137.50
  Equipo:      $36.00
  Total:       $270.68

Costos Indirectos (15%):
  $270.68 × 0.15 = $40.60

Utilidad (10%):
  ($270.68 + $40.60) × 0.10 = $31.13

Precio Unitario Total:
  $270.68 + $40.60 + $31.13 = $342.41/m³
```

### Presupuesto con 25.5 m³ de Concreto

```
25.5 m³ × $342.41/m³ = $8,731.46
```

---

## 🔑 Características Clave

### 1. **Cálculo Automático Multi-Nivel**

```
Recursos (Material, Labor, Equipment)
  ↓
Components en APU
  ↓
Unit Price Analysis (cálculo automático)
  ↓
Budget Items (usa APU)
  ↓
Budget Totals (suma items + factores)
  ↓
Material Explosion (agrega todo)
```

### 2. **Precisión Matemática**

- **Decimal.js** para evitar errores de punto flotante
- Redondeo a 2 decimales en totales
- Operaciones monetarias seguras

### 3. **Flexibilidad en Factores**

- Indirectos configurables (default 15%)
- Utilidad configurable (default 10%)
- Desperdicio por material (5-10%)

### 4. **Cálculo Incremental**

Solo recalcula lo necesario:
- Cambio en precio → recalcula APU
- Cambio en cantidad → recalcula item + totals
- Optimizado para grandes presupuestos

### 5. **Vinculación con "Objeto Génesis"**

```typescript
BudgetItem {
  conceptId: "concreto-id",
  spaceId: "cocina-id",  // ← Link al espacio
  quantity: 12.5,        // m³ de concreto en cocina
  unitPrice: 342.41,
  subtotal: 4280.13
}
```

Permite:
- Costos por espacio
- Tracking detallado
- Reportes por área

---

## 📈 Flujo Completo de Uso

### 1. Setup Inicial (una vez)

```bash
npm run seed
```

Carga materiales, mano de obra, equipo y conceptos base.

### 2. Crear APU para Concepto

```bash
POST /api/v1/concepts/<concreto-id>/analysis
{
  "materials": [...],
  "labor": [...],
  "equipment": [...],
  "indirectCostFactor": 15,
  "profitFactor": 10
}
```

Sistema calcula automáticamente:
- Direct cost
- Indirect cost
- Profit
- **Total unit price**

### 3. Crear Presupuesto

```bash
POST /api/v1/budgets
{
  "projectId": "<uuid>",
  "name": "Casa Habitación v1",
  "userId": "<uuid>"
}
```

### 4. Agregar Items

```bash
POST /api/v1/budgets/<budget-id>/items
{
  "conceptId": "<concreto-id>",
  "quantity": 25.5,
  "spaceId": "<cocina-id>"
}
```

Sistema:
- Obtiene unit price del APU
- Calcula subtotal
- Recalcula totales del budget

### 5. Ver Explosión de Insumos

```bash
GET /api/v1/budgets/<budget-id>/explosion
```

Retorna:
- Lista completa de materiales con cantidades
- Lista de mano de obra con horas
- Lista de equipo con horas
- Desglose de costos

### 6. Resultado Final

```json
{
  "materials": [
    {
      "materialCode": "MAT-001",
      "materialName": "Cemento Portland CPC 30",
      "quantity": 10.14,
      "unit": "ton",
      "totalCost": 1521.00
    }
  ],
  "totals": {
    "materialsCost": 45230.50,
    "laborCost": 12180.00,
    "equipmentCost": 2283.19,
    "directCost": 59693.69,
    "indirectCost": 8954.05,
    "profit": 6864.77,
    "total": 75512.51
  }
}
```

---

## 🏗️ Clean Architecture en Acción

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (Controllers + Swagger)                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│       Application Layer                 │
│  (Use Cases + DTOs)                     │
│  - CalculateUnitPriceUseCase            │
│  - CalculateBudgetUseCase               │
│  - ExplodeMaterialsUseCase              │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         Domain Layer                    │
│  (Entities + Value Objects)             │
│  - Concept, UnitPriceAnalysis           │
│  - Material, Labor, Equipment           │
│  - Budget, BudgetItem                   │
│  - Money VO                             │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Infrastructure Layer               │
│  - TypeORM Repositories                 │
│  - PostgreSQL with JSONB                │
│  - REST Controllers                     │
└─────────────────────────────────────────┘
```

---

## 🎓 Lecciones Aprendidas

### 1. **JSONB para Componentes**

Usar JSONB para almacenar arrays de components:
- Flexibilidad: agregar/quitar materiales
- Performance: una query carga todo
- Snapshot: precios históricos preservados

### 2. **Cálculo vs Storage**

Almacenar resultados calculados para:
- Performance en queries
- Auditoría de cambios
- Reportes históricos

### 3. **Decimal.js Esencial**

JavaScript tiene problemas con decimales:
```javascript
0.1 + 0.2 = 0.30000000000000004 ❌
```

Decimal.js soluciona esto:
```javascript
new Decimal(0.1).plus(0.2).toNumber() = 0.3 ✅
```

### 4. **Cálculo Incremental**

Para presupuestos grandes (1000+ items):
- NO recalcular todo el presupuesto
- SOLO recalcular item modificado
- SOLO actualizar totales del budget

---

## 📊 Estadísticas

| Métrica | Valor |
|---------|-------|
| **Archivos creados** | 26 archivos |
| **Líneas de código** | ~2,400 líneas |
| **Entidades** | 7 (Concept, APU, Material, Labor, Equipment, Budget, Item) |
| **Use Cases** | 3 (Calculate APU, Calculate Budget, Explode Materials) |
| **Endpoints REST** | 19 endpoints |
| **Seed data** | 7 materials + 5 labor + 3 equipment + 6 concepts |
| **Puerto** | 3004 |

---

## 🚀 Próximos Pasos Sugeridos

### Opción A: Frontend para Costos
- UI para gestión de catálogos
- Wizard para crear APUs
- Dashboard de presupuestos
- Visualización de explosión de insumos

### Opción B: Features Avanzados
- Historial de precios con gráficas
- Comparación de presupuestos
- Ajuste por inflación/ubicación
- Importación/exportación XLSX
- Reportes PDF

### Opción C: Siguientes Microservicios
- Schedule Service (Gantt, camino crítico)
- Execution Service (app móvil para campo)
- Payroll Service (nóminas)

---

## 📝 Commits Realizados

**Commit:** `feat(costs): implement Cost Engine with APU calculation and material explosion`
- Hash: `ea02e92`
- 26 archivos, 2,405 líneas
- Branch: `claude/review-architecture-plan-011CUqSpUSN8Ys9CTsitrJ4w`
- Status: ✅ Pushed successfully

---

## 🎯 Concepto Clave: El Ciclo Completo

```
Programa Arquitectónico
  ↓ Define
  Espacio "Cocina"
    requiredArea: 20 m²
  
Design Service
  ↓ Vincula
  Polilínea → Espacio
    realArea: 20 m²
  
Cost Engine (AQUÍ)
  ↓ Presupuesta
  Budget Item:
    Concept: "Muro block"
    spaceId: "cocina-id"
    quantity: 40 m² (20m² × 2 muros)
    unitPrice: $145/m²
    subtotal: $5,800
  
  Explosión muestra:
    Block: 540 pzas
    Mortero: 2.8 m³
    Oficial: 32 hrs
    Peón: 48 hrs
  
Siguiente: Schedule Service
  ↓ Programa
  Actividad "Muros Cocina"
    duration: 4 días
    resources: 1 oficial + 1.5 peones
    dependencies: [Cimientos]
  
TODO conectado al Objeto Génesis (Espacio_ID) 🎯
```

---

## 📚 Documentación Generada

- `services/costs/README.md` - Guía completa (370 líneas)
- Swagger/OpenAPI docs en `/api/docs`
- Ejemplos completos de curl
- Fórmulas matemáticas explicadas
- Flujo de uso paso a paso

---

¿Listo para la **Sesión 6**? Podemos continuar con:
1. **Schedule Service** - Gantt chart y programación CPM
2. **Frontend de Costos** - UI para APUs y presupuestos
3. **Integración completa** - Conectar todos los servicios

El Cost Engine está **100% funcional** y listo! Los presupuestos se calculan automáticamente con precisión decimal 🚀💰

¡El sistema va tomando forma! Ya tenemos:
- ✅ Programa (Espacios)
- ✅ Design (Áreas reales)
- ✅ Costs (Presupuestos)

Siguiente paso lógico: **Programación y cronogramas** 📅
