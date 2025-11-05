# Design Service - DWG/DXF Parser

Microservicio para procesar archivos DWG/DXF, extraer geometrías y vincular espacios con polilíneas.

## 📐 Características

- **Upload de archivos DWG/DXF** a almacenamiento S3-compatible (MinIO)
- **Parsing DXF** con extracción de layers y polilíneas
- **Cálculo automático de áreas** usando fórmula de Gauss (Shoelace)
- **Vinculación espacio-polilínea** con actualización de área real
- **Integración con Programa Service** para actualizar espacios
- **API REST completa** con Swagger/OpenAPI

## 🏗️ Arquitectura

### Clean Architecture

```
src/
├── domain/                     # Capa de dominio
│   ├── entities/              # Entidades de negocio
│   │   ├── drawing.entity.ts
│   │   ├── layer.entity.ts
│   │   ├── polyline.entity.ts
│   │   └── space-polyline-link.entity.ts
│   ├── value-objects/         # Objetos de valor
│   │   └── area.value-object.ts
│   └── interfaces/            # Contratos de repositorios
├── application/               # Capa de aplicación
│   ├── use-cases/            # Casos de uso
│   │   ├── upload-drawing.use-case.ts
│   │   └── link-space-to-polyline.use-case.ts
│   └── dtos/                 # Data Transfer Objects
├── infrastructure/           # Capa de infraestructura
│   ├── parsers/             # Parser DXF
│   │   └── dxf-parser.service.ts
│   ├── storage/             # Almacenamiento S3/MinIO
│   │   └── storage.service.ts
│   ├── http/                # HTTP clients y controllers
│   │   ├── programa-service.client.ts
│   │   └── controllers/
│   └── database/
└── main.ts
```

### Modelo de Datos

**Drawing** (Dibujo)
- ID, nombre, archivo URL, estado (UPLOADED, PROCESSING, PARSED, ERROR)
- Metadata: versión AutoCAD, unidades, bounding box
- Relaciones: layers, polylines

**Layer** (Capa)
- Nombre, color, visibilidad
- Relación con drawing y polylines

**Polyline** (Polilínea)
- Vértices (x, y, bulge)
- Área calculada, perímetro
- isClosed flag
- Relación con layer y space links

**SpacePolylineLink** (Vínculo)
- spaceId (del Programa Service)
- polylineId
- Tipo: MANUAL o AUTO
- Confidence score (para detección automática futura)

## 🚀 Quick Start

### 1. Variables de Entorno

Copia `.env.example` a `.env`:

```bash
# Service
PORT=3003
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=construccion_design

# S3/MinIO
S3_ENDPOINT=http://localhost:9000
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin
S3_BUCKET_NAME=construccion-drawings

# Microservices
PROGRAMA_SERVICE_URL=http://localhost:3001/api/v1
```

### 2. Iniciar Infraestructura

```bash
cd ../..
docker-compose -f infra/docker/docker-compose.yml up -d
```

Servicios disponibles:
- **PostgreSQL**: localhost:5432 (database: construccion_design)
- **MinIO API**: http://localhost:9000
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)

### 3. Instalar Dependencias

```bash
npm install
```

### 4. Ejecutar Migraciones

```bash
npm run migration:run
```

### 5. Iniciar Servicio

```bash
# Desarrollo con hot-reload
npm run dev

# Producción
npm run build
npm start
```

Servicio disponible en: **http://localhost:3003**
Swagger docs en: **http://localhost:3003/api/docs**

## 📡 API Endpoints

### Drawings

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/drawings` | Subir archivo DWG/DXF |
| GET | `/api/v1/drawings` | Listar drawings |
| GET | `/api/v1/drawings/:id` | Obtener drawing por ID |
| DELETE | `/api/v1/drawings/:id` | Eliminar drawing |
| GET | `/api/v1/drawings/:id/layers` | Obtener layers |
| GET | `/api/v1/drawings/:id/polylines` | Obtener polilíneas |

### Space-Polyline Links

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/v1/drawings/polylines/:id/link` | Vincular polilínea a espacio |
| DELETE | `/api/v1/drawings/polylines/links/:id` | Desvincular |
| GET | `/api/v1/drawings/spaces/:spaceId/polylines` | Polilíneas de un espacio |

## 🔧 Uso Ejemplo

### 1. Upload de Archivo DXF

```bash
curl -X POST http://localhost:3003/api/v1/drawings \
  -F "file=@simple-room.dxf" \
  -F "projectId=<project-uuid>" \
  -F "name=Floor Plan 1" \
  -F "userId=<user-uuid>"
```

Respuesta:
```json
{
  "id": "drawing-uuid",
  "name": "Floor Plan 1",
  "status": "UPLOADED",
  "fileUrl": "http://localhost:9000/construccion-drawings/drawings/...",
  "fileSize": 2048,
  "uploadedAt": "2024-01-15T10:30:00Z"
}
```

El servicio procesará el archivo **asíncronamente** y cambiará el status a `PARSED`.

### 2. Obtener Polilíneas Cerradas

```bash
curl http://localhost:3003/api/v1/drawings/<drawing-id>/polylines?closedOnly=true
```

Respuesta:
```json
[
  {
    "id": "polyline-uuid",
    "vertices": [
      { "x": 0, "y": 0 },
      { "x": 5, "y": 0 },
      { "x": 5, "y": 4 },
      { "x": 0, "y": 4 }
    ],
    "isClosed": true,
    "area": 20.0,
    "perimeter": 18.0,
    "layer": {
      "name": "ARCHITECTURE",
      "color": "#FF0000"
    }
  }
]
```

### 3. Vincular Polilínea a Espacio

```bash
curl -X POST http://localhost:3003/api/v1/drawings/polylines/<polyline-id>/link \
  -H "Content-Type: application/json" \
  -d '{
    "spaceId": "<space-uuid>",
    "userId": "<user-uuid>"
  }'
```

**Acción automática**: El servicio actualiza `realArea` del espacio en Programa Service.

## 🧪 Testing

```bash
# Todos los tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov
```

### Test con archivo DXF de ejemplo

```bash
# Usar el archivo de ejemplo en test/fixtures/simple-room.dxf
# Este archivo contiene 2 habitaciones (áreas: 20m² y 14m²)
```

## 📊 DXF Parser

### Formato Soportado

- **DXF (Drawing Exchange Format)**: Formato de texto de AutoCAD
- Entidades soportadas: `LWPOLYLINE`, `POLYLINE`
- Metadata: Layers, colores, versión de archivo

### Cálculo de Área

Usamos la **Fórmula de Gauss** (Shoelace formula):

```typescript
area = abs(sum(x[i] * y[i+1] - x[i+1] * y[i])) / 2
```

Solo polilíneas **cerradas** (`isClosed: true`) tienen área calculada.

## 🔗 Integración con Programa Service

El Design Service se comunica con Programa Service para:

1. **Validar espacios** antes de vincular
2. **Actualizar área real** cuando se vincula una polilínea
3. **Resetear área** cuando se desvincula

```typescript
// Cliente HTTP interno
ProgramaServiceClient.updateSpaceRealArea(spaceId, area)
```

## 🐳 Docker

```bash
# Build
docker build -t construccion/design-service .

# Run
docker run -p 3003:3003 \
  -e DB_HOST=postgres \
  -e S3_ENDPOINT=http://minio:9000 \
  construccion/design-service
```

## 🛠️ Tecnologías

- **NestJS 10**: Framework backend
- **TypeORM**: ORM para PostgreSQL
- **dxf-parser**: Parser DXF open source
- **AWS SDK (S3 Client)**: Para MinIO/S3
- **Swagger/OpenAPI**: Documentación de API
- **Jest**: Testing framework

## 📝 Notas Importantes

### DWG vs DXF

- **DXF** es soportado nativamente (formato de texto)
- **DWG** requiere ODA SDK (licencia comercial) - No implementado aún
- Para MVP, convertir DWG a DXF usando AutoCAD o LibreCAD

### MinIO vs AWS S3

- **MinIO**: S3-compatible, self-hosted, gratuito
- **AWS S3**: Producción con alta disponibilidad
- El código es compatible con ambos (mismo SDK)

### Procesamiento Asíncrono

El parsing de archivos DXF ocurre **asíncronamente** después del upload:
1. Upload → Status: `UPLOADED`
2. Processing → Status: `PROCESSING`
3. Success → Status: `PARSED`
4. Error → Status: `ERROR` (con `errorMessage`)

## 🚀 Próximos Pasos (Fase 3)

- [ ] Soporte DWG con ODA SDK
- [ ] Auto-detección de espacios por nombre de layer
- [ ] OCR para leer textos en dibujos
- [ ] ML para identificar tipos de espacios
- [ ] Visualización 2D/3D con Three.js
- [ ] Mediciones interactivas
- [ ] Comparación de versiones de dibujos

## 📄 Licencia

MIT License - Ver archivo LICENSE
