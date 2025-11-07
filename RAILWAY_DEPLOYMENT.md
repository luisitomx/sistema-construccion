# Guía de Deployment en Railway.app 🚀

Esta guía te ayudará a desplegar el **Cost Engine (Backend API)** en Railway.app en menos de 5 minutos.

---

## 📋 Prerequisitos

✅ Cuenta de GitHub (ya la tienes)
✅ Repositorio en GitHub (ya lo tienes)
✅ Código commiteado y pusheado (ya está)

---

## 🚀 Pasos de Deployment

### 1. Crear Cuenta en Railway

1. Ve a **[railway.app](https://railway.app)**
2. Click en **"Login"**
3. Selecciona **"Login with GitHub"**
4. Autoriza Railway a acceder a tu GitHub

---

### 2. Crear Nuevo Proyecto

1. En el dashboard de Railway, click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Busca y selecciona tu repositorio: **`sistema-construccion`**
4. Railway comenzará a detectar el proyecto

---

### 3. Agregar Base de Datos PostgreSQL

1. En tu proyecto de Railway, click en **"+ New"**
2. Selecciona **"Database"**
3. Selecciona **"Add PostgreSQL"**
4. Railway creará automáticamente la base de datos y configurará las variables de entorno

**Variables automáticas que Railway configura:**
- `DATABASE_URL`
- `PGHOST`
- `PGPORT`
- `PGUSER`
- `PGPASSWORD`
- `PGDATABASE`

---

### 4. Configurar Variables de Entorno del Servicio

En tu servicio (no en la base de datos), ve a **"Variables"** y agrega:

```env
# Node Environment
NODE_ENV=production

# Puerto (Railway lo asigna automáticamente, pero puedes definirlo)
PORT=3004

# Database (Railway las inyecta automáticamente desde PostgreSQL, pero verifica los nombres)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}
```

**Nota**: Railway usa la sintaxis `${{Postgres.VARIABLE}}` para referenciar variables de otros servicios.

---

### 5. Configurar Build & Deploy

Railway debería detectar automáticamente el `nixpacks.toml` y `railway.json` en la raíz del proyecto.

**Verificar configuración** (en Settings → Deploy):

- **Build Command**:
  ```bash
  cd services/costs && pnpm install && pnpm run build
  ```

- **Start Command**:
  ```bash
  cd services/costs && pnpm run start:prod
  ```

**El script `start:prod` automáticamente**:
1. Ejecuta migraciones (`pnpm run migrate`)
2. Carga datos de seed
3. Inicia el servidor NestJS

---

### 6. Deploy

1. Railway automáticamente iniciará el deployment al detectar el push a GitHub
2. Puedes ver los logs en tiempo real en la pestaña **"Deployments"**
3. El proceso tomará 2-3 minutos

**Logs esperados**:
```
✓ Installing dependencies...
✓ Building TypeScript...
✓ Running migrations...
✓ Starting server...
[Nest] Cost Engine running on http://0.0.0.0:3004
```

---

### 7. Obtener URL Pública

1. Una vez que el deployment esté completo, ve a **"Settings"**
2. En la sección **"Domains"**, verás una URL como:
   ```
   https://sistema-construccion-production.up.railway.app
   ```
3. **Copia esta URL** - la necesitarás para el HTML

---

### 8. Verificar Deployment

Prueba los endpoints:

```bash
# Listar conceptos
curl https://TU-URL.up.railway.app/precios-unitarios/conceptos

# Obtener concepto específico
curl https://TU-URL.up.railway.app/precios-unitarios/conceptos/ALBA-001

# Ver documentación Swagger
https://TU-URL.up.railway.app/api/docs
```

---

### 9. Actualizar HTML Demo

1. Edita `precios-unitarios-demo.html`
2. Busca la línea 61:
   ```html
   <input type="text" id="apiUrl" value="http://localhost:3004"
   ```
3. Cámbiala a:
   ```html
   <input type="text" id="apiUrl" value="https://TU-URL.up.railway.app"
   ```
4. Commit y push:
   ```bash
   git add precios-unitarios-demo.html
   git commit -m "feat: update HTML demo with Railway production URL"
   git push
   ```

---

## 🔧 Troubleshooting

### Error: "Cannot connect to database"

**Solución**:
1. Verifica que el servicio PostgreSQL esté activo (verde)
2. Revisa las variables de entorno: `DB_HOST`, `DB_PASSWORD`, etc.
3. Asegúrate de usar la sintaxis `${{Postgres.VARIABLE}}`

---

### Error: "Build failed"

**Solución**:
1. Verifica que el `nixpacks.toml` esté en la raíz del repo
2. Revisa los logs de build en Railway
3. Asegúrate de que `pnpm-lock.yaml` esté commiteado

---

### Error: "Migration failed"

**Solución**:
1. Las migraciones usan `psql` - Railway lo incluye automáticamente
2. Verifica que los archivos SQL estén en:
   ```
   services/costs/src/infrastructure/database/migrations/
   ```
3. Revisa logs para ver error específico de SQL

---

### Error: "Port already in use"

**Solución**:
Railway asigna el puerto automáticamente. Asegúrate de que tu `main.ts` use:
```typescript
const port = process.env.PORT || 3004;
await app.listen(port, '0.0.0.0');
```

---

## 💡 Tips

### Habilitar Auto-Deploy

Railway puede hacer deploy automático en cada push a GitHub:

1. Ve a **Settings → Service**
2. En **"Deployments"**, habilita **"Automatic Deployments"**
3. Selecciona el branch: `claude/review-architecture-plan-011CUqSpUSN8Ys9CTsitrJ4w`

Ahora cada push ejecutará un nuevo deployment.

### Ver Logs en Tiempo Real

```bash
# Instalar Railway CLI (opcional)
npm install -g @railway/cli

# Login
railway login

# Ver logs
railway logs
```

### Monitoreo

Railway te da métricas gratuitas:
- CPU usage
- Memory usage
- Request count
- Response times

Ve a la pestaña **"Metrics"** de tu servicio.

---

## 💰 Costos

**Plan Gratuito de Railway**:
- $5 USD de crédito gratis al mes
- ~500 horas de uptime
- Suficiente para testing y demos

**Para este proyecto**:
- Backend: ~$2-3/mes (uso ligero)
- PostgreSQL: ~$1-2/mes
- **Total estimado**: ~$3-5/mes (cabe en el plan gratuito)

---

## 🔄 Actualizar Deployment

Para deployar cambios nuevos:

```bash
git add .
git commit -m "feat: new feature"
git push
```

Railway detectará el push y hará deploy automáticamente (si habilitaste auto-deploy).

---

## 🎯 Resultado Final

Después de seguir esta guía tendrás:

✅ Backend desplegado en Railway
✅ PostgreSQL configurado y conectado
✅ URL pública funcionando
✅ Migraciones ejecutadas
✅ Datos de seed cargados
✅ HTML demo funcionando desde cualquier navegador

---

## 📞 Soporte

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Railway Status**: https://status.railway.app

---

**¡Listo!** Tu backend ahora está en producción 🎉
