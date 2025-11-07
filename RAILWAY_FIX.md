# 🔧 Railway Error Fix - "failed to exec pid1"

## El Problema

Railway está intentando ejecutar comandos desde la raíz del monorepo, pero el servicio está en `services/costs/`.

---

## ✅ SOLUCIÓN SIMPLE (Recomendada)

Configura el **Root Directory** en Railway para apuntar directamente al servicio:

### Pasos:

1. **Ve a tu proyecto en Railway**
2. **Click en tu servicio** (el que tiene el error)
3. **Settings → General**
4. Busca **"Root Directory"**
5. Cambia de `/` a: **`services/costs`**
6. **Save** y espera redeploy automático

**¡Eso es todo!** Railway ahora tratará `services/costs` como raíz y todos los comandos funcionarán.

---

## 🔧 Configuración Alternativa (Si la anterior no funciona)

Si la opción de Root Directory no está disponible o no funciona, usa esta configuración:

### 1. Settings → Build

**Build Command**:
```bash
cd services/costs && pnpm install && pnpm run build
```

### 2. Settings → Deploy

**Start Command**:
```bash
cd services/costs && node dist/main.js
```

**Custom Start Command**: ✅ Habilitar

### 3. Variables de Entorno

Asegúrate de tener todas estas variables configuradas:

```env
# Node
NODE_ENV=production
PORT=3004

# Database (desde PostgreSQL service)
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}

# Railway (auto)
RAILWAY_ENVIRONMENT=production
```

### 4. Redeploy

Click en **"Deploy"** → **"Redeploy"**

---

## 🚀 Opción Avanzada: Usar Script de Inicio

Si aún tienes problemas, usa el script `railway-start.sh`:

### En Railway Settings → Deploy:

**Start Command**:
```bash
bash railway-start.sh
```

El script automáticamente:
- ✅ Navega a `services/costs`
- ✅ Instala dependencias
- ✅ Compila TypeScript
- ✅ Ejecuta migraciones
- ✅ Inicia el servidor

---

## 🐛 Troubleshooting

### Error: "pnpm: command not found"

**Solución**: Cambia los comandos para usar `npm`:

```bash
cd services/costs && npm install && npm run build
cd services/costs && npm run start:prod
```

### Error: "PostgreSQL connection refused"

**Solución**: Verifica que:
1. El servicio PostgreSQL esté running (verde)
2. Las variables `${{Postgres.*}}` estén correctas
3. La sintaxis sea exactamente `${{Postgres.PGHOST}}` (con doble llave)

### Error: "Cannot find module 'dist/main.js'"

**Solución**: El build falló. Revisa logs de build y verifica:
1. TypeScript se instaló correctamente
2. El comando `pnpm run build` se ejecutó
3. Existe el archivo `tsconfig.json`

### Logs útiles

Para ver logs en tiempo real:
```
Railway → Tu Servicio → Deployments → Click en último deploy → Ver logs
```

---

## ✅ Verificación Final

Una vez que el deploy sea exitoso, verás en los logs:

```
[Nest] Cost Engine running on http://0.0.0.0:3004
[Nest] Swagger docs available at http://0.0.0.0:3004/api/docs
```

Prueba tu API:
```bash
curl https://TU-URL.up.railway.app/precios-unitarios/conceptos
```

Deberías recibir un JSON con 10 conceptos.

---

## 💡 Recomendación

**Usa la SOLUCIÓN SIMPLE** (Root Directory = `services/costs`)

Es la forma más limpia y Railway manejará todo automáticamente sin necesidad de comandos personalizados.

---

¿Aún tienes problemas? Comparte los logs completos del deployment.
