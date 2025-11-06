# Sistema Dinámico de Precios Unitarios - Guía de Instalación

## Descripción

Sistema que construye Precios Unitarios dinámicamente para proyectos de construcción de vivienda en México, permitiendo calcular costos directos, indirectos, financiamiento y utilidad basándose en catálogos de materiales, mano de obra y rendimientos.

## Requisitos Previos

- Node.js 20+ LTS
- PostgreSQL 14+
- Docker (opcional, para desarrollo local)

## Instalación

### 1. Instalar Dependencias

```bash
cd services/costs
npm install
```

### 2. Configurar Base de Datos

**Opción A: Con Docker**

```bash
cd ../../infra/docker
docker compose up -d postgres
```

**Opción B: PostgreSQL local**

Asegúrate de tener PostgreSQL corriendo y crea la base de datos:

```sql
CREATE DATABASE construccion_costs;
```

### 3. Configurar Variables de Entorno

```bash
cd services/costs
cp .env.example .env
```

Edita `.env` con tus credenciales:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=construccion_costs
PORT=3004
NODE_ENV=development
```

### 4. Ejecutar Migraciones SQL

Las migraciones están en `src/infrastructure/database/migrations/`:

```bash
# Opción A: Usando psql
export PGPASSWORD=postgres
psql -h localhost -U postgres -d construccion_costs < src/infrastructure/database/migrations/001_init_database_precios_unitarios.sql
psql -h localhost -U postgres -d construccion_costs < src/infrastructure/database/migrations/002_insert_insumos_conceptos.sql

# Opción B: Usando script automático
npm run migrate
```

### 5. Ejecutar Migrations Script (Alternativo)

Crea `migrate.sh`:

```bash
#!/bin/bash
export PGPASSWORD=${DB_PASSWORD:-postgres}
DB_HOST=${DB_HOST:-localhost}
DB_USER=${DB_USERNAME:-postgres}
DB_NAME=${DB_DATABASE:-construccion_costs}

echo "🔧 Ejecutando migraciones..."

psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f src/infrastructure/database/migrations/001_init_database_precios_unitarios.sql
if [ $? -eq 0 ]; then
  echo "✅ Migración 001 completada"
else
  echo "❌ Error en migración 001"
  exit 1
fi

psql -h $DB_HOST -U $DB_USER -d $DB_NAME -f src/infrastructure/database/migrations/002_insert_insumos_conceptos.sql
if [ $? -eq 0 ]; then
  echo "✅ Migración 002 completada"
else
  echo "❌ Error en migración 002"
  exit 1
fi

echo "✨ Todas las migraciones completadas exitosamente"
```

```bash
chmod +x migrate.sh
./migrate.sh
```

### 6. Iniciar Servidor

```bash
npm run dev
```

El servidor estará disponible en `http://localhost:3004`

## Verificación de Instalación

### 1. Verificar Tablas Creadas

```bash
psql -h localhost -U postgres -d construccion_costs -c "\dt"
```

Deberías ver:

- `materiales`
- `mano_obra`
- `rendimientos`
- `herramienta_equipo`
- `conceptos_base`
- `insumos_concepto`
- `factores_sobrecosto`
- `precios_unitarios_calculados`

### 2. Verificar Datos Iniciales

```bash
psql -h localhost -U postgres -d construccion_costs -c "SELECT COUNT(*) FROM materiales;"
psql -h localhost -U postgres -d construccion_costs -c "SELECT COUNT(*) FROM conceptos_base;"
```

### 3. Probar API

```bash
# Listar conceptos disponibles
curl http://localhost:3004/precios-unitarios/conceptos

# Obtener detalle de un concepto
curl http://localhost:3004/precios-unitarios/conceptos/ALBA-001

# Calcular precio unitario
curl -X POST http://localhost:3004/precios-unitarios/calcular \
  -H "Content-Type: application/json" \
  -d '{
    "conceptoClave": "ALBA-001",
    "configuracion": {
      "tipoCliente": "privado",
      "indirectosCampo": 5,
      "indirectosOficina": 8,
      "financiamiento": 3,
      "utilidad": 12
    }
  }'
```

## Estructura de Datos

### Conceptos Base Incluidos

#### Albañilería
- **ALBA-001**: Muro de tabique rojo recocido
- **ALBA-002**: Muro de block de concreto
- **ALBA-003**: Aplanado de yeso
- **ALBA-004**: Firme de concreto

#### Instalaciones
- **INST-001**: Instalación hidráulica PVC
- **INST-002**: Instalación sanitaria PVC
- **INST-003**: Instalación eléctrica básica

#### Acabados
- **ACAB-001**: Pintura vinílica en muros
- **ACAB-002**: Colocación de piso cerámico
- **ACAB-003**: Colocación de azulejo

### Materiales Incluidos

- Cementantes: Cemento Portland
- Agregados: Grava, Arena
- Acero: Varillas, Alambre
- Tabique y Block
- Acabados: Yeso, Pintura, Azulejo, Piso
- Instalaciones: Tubería PVC, Cableado, Contactos

## API Endpoints

### Conceptos

- `GET /precios-unitarios/conceptos` - Listar conceptos
  - Query params: `partida`, `subpartida`, `tipoObra`, `busqueda`
- `GET /precios-unitarios/conceptos/:clave` - Detalle de concepto
- `GET /precios-unitarios/conceptos/partidas` - Listar partidas
- `GET /precios-unitarios/conceptos/partidas/:partida/subpartidas` - Subpartidas

### Materiales

- `GET /precios-unitarios/materiales` - Listar materiales
  - Query params: `categoria`, `subcategoria`
- `GET /precios-unitarios/materiales/:clave` - Detalle de material
- `GET /precios-unitarios/materiales/categorias` - Listar categorías

### Cálculo

- `POST /precios-unitarios/calcular` - Calcular precio unitario

## Swagger Documentation

Accede a la documentación interactiva en:

```
http://localhost:3004/api
```

## Troubleshooting

### Error: Connection refused

Verifica que PostgreSQL esté corriendo:

```bash
# Docker
docker compose ps

# Linux
sudo systemctl status postgresql

# macOS
brew services list
```

### Error: Database does not exist

Crea la base de datos:

```bash
psql -h localhost -U postgres -c "CREATE DATABASE construccion_costs;"
```

### Error: Role does not exist

Crea el usuario de PostgreSQL:

```bash
psql -h localhost -U postgres -c "CREATE USER postgres WITH PASSWORD 'postgres';"
psql -h localhost -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE construccion_costs TO postgres;"
```

## Próximos Pasos

1. ✅ Ejecutar migraciones SQL
2. ✅ Verificar datos de prueba
3. ✅ Probar cálculo de PU
4. 🔲 Integrar con frontend React
5. 🔲 Agregar tests unitarios
6. 🔲 Agregar más conceptos del catálogo BDAU

## Referencias

- [Documentación NestJS](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [BDAU - Base de Datos de Análisis Unitarios México](http://www.cmic.org.mx/)
