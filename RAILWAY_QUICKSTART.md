# Railway Deployment - Quick Start ⚡

Deploy en **5 minutos** siguiendo estos pasos:

## 🚀 Pasos Rápidos

### 1. Login en Railway
```
👉 https://railway.app
Click "Login with GitHub"
```

### 2. Crear Proyecto
```
New Project → Deploy from GitHub repo
Selecciona: sistema-construccion
```

### 3. Agregar PostgreSQL
```
+ New → Database → Add PostgreSQL
```

### 4. Variables de Entorno
En tu servicio, agrega estas variables:

```env
NODE_ENV=production
PORT=3004
DB_HOST=${{Postgres.PGHOST}}
DB_PORT=${{Postgres.PGPORT}}
DB_USERNAME=${{Postgres.PGUSER}}
DB_PASSWORD=${{Postgres.PGPASSWORD}}
DB_DATABASE=${{Postgres.PGDATABASE}}
```

### 5. Deploy
Railway auto-detecta el build y deploy con `nixpacks.toml`.

Espera 2-3 minutos y verás:
```
✓ Build successful
✓ Deployment live
```

### 6. Obtener URL
```
Settings → Domains
Copia: https://tu-proyecto.up.railway.app
```

### 7. Probar
```bash
curl https://tu-proyecto.up.railway.app/precios-unitarios/conceptos
```

### 8. Actualizar HTML
Edita `precios-unitarios-demo.html` línea 64:
```html
value="https://tu-proyecto.up.railway.app"
```

---

## 🎯 ¿Problemas?

Ver guía completa: [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

---

**¡Listo en 5 minutos!** 🎉
