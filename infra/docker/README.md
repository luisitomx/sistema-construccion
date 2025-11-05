# Infrastructure - Docker Compose

Esta carpeta contiene la configuración de Docker Compose para la infraestructura del proyecto.

## Servicios Incluidos

- **PostgreSQL 16**: Base de datos principal para datos core (Puerto 5432)
- **MongoDB 7**: Base de datos para documentos y logs (Puerto 27017)
- **Redis 7**: Cache y gestión de sesiones (Puerto 6379)
- **pgAdmin**: Interfaz web para PostgreSQL (Puerto 5050)

## Comandos Disponibles

### Desde la raíz del proyecto:

```bash
# Levantar todos los servicios
npm run infra:up

# Detener todos los servicios
npm run infra:down

# Ver logs de los servicios
npm run infra:logs

# Reset completo (elimina volúmenes y recrea)
npm run infra:reset
```

### Comandos directos de Docker Compose:

```bash
cd infra/docker

# Levantar servicios
docker-compose up -d

# Detener servicios
docker-compose down

# Ver logs
docker-compose logs -f

# Ver estado de servicios
docker-compose ps

# Reset completo
docker-compose down -v
docker-compose up -d
```

## Credenciales

### PostgreSQL
- **Host**: localhost
- **Port**: 5432
- **Database**: construccion_db
- **User**: admin
- **Password**: admin123

### MongoDB
- **Host**: localhost
- **Port**: 27017
- **Database**: construccion_logs
- **User**: admin
- **Password**: admin123

### Redis
- **Host**: localhost
- **Port**: 6379
- **Password**: (sin password)

### pgAdmin
- **URL**: http://localhost:5050
- **Email**: admin@construccion.com
- **Password**: admin123

## Verificar que los servicios están corriendo

```bash
# PostgreSQL
docker exec -it construccion-postgres pg_isready -U admin

# MongoDB
docker exec -it construccion-mongodb mongosh --eval "db.adminCommand('ping')"

# Redis
docker exec -it construccion-redis redis-cli ping
```

## Volúmenes de Datos

Los datos se persisten en volúmenes Docker:
- `postgres_data`: Datos de PostgreSQL
- `mongo_data`: Datos de MongoDB
- `redis_data`: Datos de Redis
- `pgadmin_data`: Configuración de pgAdmin

## Health Checks

Todos los servicios tienen health checks configurados. Puedes verificar el estado con:

```bash
docker-compose ps
```

Los servicios con status `healthy` están listos para usarse.
