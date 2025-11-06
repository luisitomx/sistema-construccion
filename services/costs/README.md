# Cost Engine - Motor de Costos

Microservicio para gestión de costos, presupuestos y explosión de insumos en proyectos de construcción.

## 📐 Características

- **Catálogo de Conceptos** (Partidas de construcción)
- **Análisis de Precios Unitarios (APU)** con desglose de materiales, mano de obra y equipo
- **Cálculo automático** de costos directos, indirectos y utilidad
- **Presupuestos** vinculados a proyectos
- **Explosión de insumos** (agregación de materiales, labor, equipo)
- **Cálculo incremental** para optimizar performance
- **Versionado de presupuestos**

## 🏗️ Arquitectura

### Clean Architecture

```
src/
├── domain/                     # Capa de dominio
│   ├── entities/              # Entidades de negocio
│   │   ├── concept.entity.ts
│   │   ├── unit-price-analysis.entity.ts
│   │   ├── material.entity.ts
│   │   ├── labor.entity.ts
│   │   ├── equipment.entity.ts
│   │   ├── budget.entity.ts
│   │   └── budget-item.entity.ts
│   └── value-objects/         # Objetos de valor
│       └── money.value-object.ts
├── application/               # Capa de aplicación
│   ├── use-cases/            # Casos de uso
│   │   ├── calculate-unit-price.use-case.ts
│   │   ├── calculate-budget.use-case.ts
│   │   └── explode-materials.use-case.ts
│   └── dtos/                 # Data Transfer Objects
├── infrastructure/           # Capa de infraestructura
│   ├── http/controllers/    # REST API
│   └── database/seeds/      # Datos iniciales
└── main.ts
```

### Modelo de Datos

**Concept** (Concepto/Partida)
- code, name, unit, category
- Relación 1-1 con UnitPriceAnalysis

**UnitPriceAnalysis** (Análisis de Precio Unitario)
- Components: materials[], labor[], equipment[]
- Factors: indirectCostFactor, profitFactor
- Calculated: directCost, indirectCost, profit, totalUnitPrice

**Material, Labor, Equipment** (Recursos)
- code, name, current prices
- Used in APU components

**Budget** (Presupuesto)
- projectId, version, status
- items: BudgetItem[]
- Calculated totals

**BudgetItem** (Item de presupuesto)
- concept, quantity, unitPrice
- Optional spaceId linkage

## 🚀 Quick Start

### 1. Variables de Entorno

```bash
PORT=3004
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=construccion_costs
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Iniciar Base de Datos

```bash
cd ../../infra/docker
docker-compose up -d postgres
```

### 4. Ejecutar Seed

```bash
npm run seed
```

Esto creará:
- 7 materiales (cemento, arena, grava, block, varilla, etc.)
- 5 categorías de mano de obra (peón, oficial, maestro, etc.)
- 3 equipos (revolvedora, vibrador, andamio)
- 6 conceptos base (limpieza, excavación, cimbra, concreto, acero, muro)

### 5. Iniciar Servicio

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```

Servicio en: **http://localhost:3004**
Swagger docs: **http://localhost:3004/api/docs**

## 📡 API Endpoints

### Conceptos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/concepts` | Crear concepto |
| GET | `/api/v1/concepts` | Listar conceptos |
| GET | `/api/v1/concepts/:id` | Obtener concepto |
| PUT | `/api/v1/concepts/:id` | Actualizar concepto |
| POST | `/api/v1/concepts/:id/analysis` | Crear APU |
| GET | `/api/v1/concepts/:id/analysis` | Obtener APU |

### Presupuestos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/budgets` | Crear presupuesto |
| GET | `/api/v1/budgets` | Listar presupuestos |
| GET | `/api/v1/budgets/:id` | Obtener presupuesto |
| PUT | `/api/v1/budgets/:id` | Actualizar |
| POST | `/api/v1/budgets/:id/items` | Agregar item |
| DELETE | `/api/v1/budgets/items/:id` | Eliminar item |
| POST | `/api/v1/budgets/:id/calculate` | Recalcular |
| GET | `/api/v1/budgets/:id/explosion` | Explosión de insumos |

### Materiales, Mano de Obra, Equipo

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/materials` | Crear material |
| GET | `/api/v1/materials` | Listar materiales |
| PUT | `/api/v1/materials/:id` | Actualizar |
| POST | `/api/v1/labor` | Crear categoría MO |
| GET | `/api/v1/labor` | Listar MO |
| POST | `/api/v1/equipment` | Crear equipo |
| GET | `/api/v1/equipment` | Listar equipo |

## 🔧 Uso Ejemplo

### 1. Crear Análisis de Precio Unitario

Para el concepto "Concreto f'c=250 kg/cm²":

```bash
curl -X POST http://localhost:3004/api/v1/concepts/<concept-id>/analysis \
  -H "Content-Type: application/json" \
  -d '{
    "materials": [
      {
        "materialId": "<cemento-id>",
        "quantity": 0.38,
        "wasteFactor": 0.05
      },
      {
        "materialId": "<arena-id>",
        "quantity": 0.51,
        "wasteFactor": 0.05
      },
      {
        "materialId": "<grava-id>",
        "quantity": 0.76,
        "wasteFactor": 0.05
      }
    ],
    "labor": [
      {
        "laborId": "<oficial-id>",
        "hours": 2.5,
        "performance": 3.0
      },
      {
        "laborId": "<peon-id>",
        "hours": 5.0,
        "performance": 3.0
      }
    ],
    "equipment": [
      {
        "equipmentId": "<revolvedora-id>",
        "hours": 2.0
      },
      {
        "equipmentId": "<vibrador-id>",
        "hours": 1.5
      }
    ],
    "indirectCostFactor": 15,
    "profitFactor": 10,
    "validFrom": "2024-01-01"
  }'
```

**Resultado calculado automáticamente:**
```json
{
  "id": "apu-uuid",
  "directCost": 1850.50,
  "indirectCost": 277.58,
  "profit": 212.81,
  "totalUnitPrice": 2340.89
}
```

### 2. Crear Presupuesto

```bash
curl -X POST http://localhost:3004/api/v1/budgets \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": "<project-uuid>",
    "name": "Presupuesto Casa Habitación",
    "description": "Versión 1.0",
    "userId": "<user-uuid>"
  }'
```

### 3. Agregar Items al Presupuesto

```bash
curl -X POST http://localhost:3004/api/v1/budgets/<budget-id>/items \
  -H "Content-Type: application/json" \
  -d '{
    "conceptId": "<concreto-concept-id>",
    "quantity": 25.5,
    "spaceId": "<space-uuid>"
  }'
```

### 4. Recalcular Presupuesto

```bash
curl -X POST http://localhost:3004/api/v1/budgets/<budget-id>/calculate
```

**Resultado:**
```json
{
  "subtotal": 59693.69,
  "indirectCosts": 8954.05,
  "profit": 6864.77,
  "total": 75512.51
}
```

### 5. Obtener Explosión de Insumos

```bash
curl http://localhost:3004/api/v1/budgets/<budget-id>/explosion
```

**Resultado:**
```json
{
  "materials": [
    {
      "materialCode": "MAT-001",
      "materialName": "Cemento Portland CPC 30",
      "quantity": 10.14,
      "unit": "ton",
      "unitPrice": 150,
      "totalCost": 1521.00
    },
    {
      "materialCode": "MAT-002",
      "materialName": "Arena",
      "quantity": 13.52,
      "unit": "m³",
      "unitPrice": 25,
      "totalCost": 338.00
    }
  ],
  "labor": [...],
  "equipment": [...],
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

## 📊 Cálculo de Precios Unitarios

### Fórmula APU

```
Costo Directo = Σ Materiales + Σ Mano Obra + Σ Equipo

Materiales = Cantidad × (1 + % Desperdicio) × Precio
Mano Obra = Horas × Tarifa Horaria
Equipo = Horas × Tarifa Horaria

Costo Indirecto = Costo Directo × Factor Indirectos (15%)
Utilidad = (Costo Directo + Indirectos) × Factor Utilidad (10%)

Precio Unitario Total = Costo Directo + Indirecto + Utilidad
```

### Ejemplo Concreto f'c=250 kg/cm²

**Materiales:**
- Cemento: 0.38 ton × 1.05 × $150 = $59.85
- Arena: 0.51 m³ × 1.05 × $25 = $13.39
- Grava: 0.76 m³ × 1.05 × $30 = $23.94
- **Subtotal materiales:** $97.18

**Mano de Obra:**
- Oficial: 2.5 hrs × $25/hr = $62.50
- Peón: 5.0 hrs × $15/hr = $75.00
- **Subtotal MO:** $137.50

**Equipo:**
- Revolvedora: 2.0 hrs × $12/hr = $24.00
- Vibrador: 1.5 hrs × $8/hr = $12.00
- **Subtotal equipo:** $36.00

**Totales:**
- Costo Directo: $270.68
- Indirectos (15%): $40.60
- Utilidad (10%): $31.13
- **Precio Unitario: $342.41/m³**

## 🔗 Integración con Espacios

Los items del presupuesto pueden vincularse a espacios (del Programa Service):

```typescript
{
  conceptId: "concreto-id",
  quantity: 25.5,
  spaceId: "cocina-space-id"  // Opcional: vincula a espacio
}
```

Esto permite:
- Presupuestos por espacio
- Tracking de costos por área
- Reportes detallados

## 🚀 Próximos Pasos

### Fase 3 (Futuro)
1. **Historial de precios** con análisis de tendencias
2. **Comparación de presupuestos** (versiones)
3. **Reportes PDF** con gráficas
4. **Importación/Exportación** XLSX
5. **Ajuste de precios** por inflación/ubicación
6. **Presupuesto por fases** de construcción

## 🧪 Testing

```bash
# Todos los tests
npm test

# Con cobertura
npm run test:cov
```

## 📝 Notas Importantes

### Factores Configurables

Los factores de costo indirecto y utilidad son configurables:
- **Indirectos**: 10-20% (default: 15%)
- **Utilidad**: 8-15% (default: 10%)

### Cálculo Incremental

El sistema solo recalcula items modificados:
- Cambio en cantidad → recalcula item + totales de budget
- Cambio en precio de material → recalcula APU + items + budgets

### Versionado

Los presupuestos soportan versiones:
- Versión 1: Presupuesto inicial
- Versión 2: Ajustes durante obra
- Versión 3: Final ejecutado

## 📄 Licencia

MIT License
