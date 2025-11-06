# Execution Service - Mobile App

Aplicación móvil React Native para trabajadores de campo en proyectos de construcción. Permite reportar avance de obra, actualizar progreso de actividades, tomar fotos y generar reportes diarios **offline-first** con sincronización automática.

## 🎯 Características Principales

- ✅ **Offline-First** - Funciona completamente sin internet
- ✅ **Sincronización Automática** - Sync en background cuando hay conexión
- ✅ **Actualización de Progreso** - Control deslizante para % completado
- ✅ **Reportes Diarios** - Bitácora de trabajo con fotos
- ✅ **Actividades Críticas** - Vista destacada de ruta crítica
- ✅ **Filtros y Búsqueda** - Encuentra actividades rápidamente
- ✅ **Indicador de Estado** - Visualiza si estás online/offline
- ✅ **Integración CPM** - Muestra información del camino crítico

---

## 📱 Stack Tecnológico

- **Framework**: React Native con Expo ~50.0.0
- **Navigation**: React Navigation v6
- **Base de Datos Local**: WatermelonDB + SQLite
- **API Client**: Axios
- **Storage Seguro**: Expo SecureStore
- **Fechas**: date-fns
- **Gestos**: React Native Gesture Handler
- **Cámara**: Expo Camera + Image Picker

---

## 🚀 Instalación y Configuración

### Pre-requisitos

- Node.js 20+ LTS
- npm o yarn
- Expo CLI: `npm install -g expo-cli`
- Para iOS: Xcode y simulador iOS
- Para Android: Android Studio y emulador Android
- Expo Go app (opcional, para testing en dispositivo físico)

### 1. Instalar Dependencias

```bash
cd apps/mobile
npm install
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
# Schedule Service API
EXPO_PUBLIC_SCHEDULE_API_URL=http://localhost:3005
EXPO_PUBLIC_AUTH_API_URL=http://localhost:3001

# Para testing en dispositivo físico, usar IP local:
# EXPO_PUBLIC_SCHEDULE_API_URL=http://192.168.1.100:3005
```

**Nota**: En Expo, las variables deben empezar con `EXPO_PUBLIC_` para ser accesibles en el cliente.

### 3. Iniciar el Proyecto

```bash
# Iniciar Expo Dev Server
npm start

# O directamente en plataforma específica
npm run android    # Android
npm run ios        # iOS
npm run web        # Web (experimental)
```

### 4. Escanear QR Code

- **iOS**: Abre la cámara y escanea el QR
- **Android**: Abre Expo Go app y escanea el QR

---

## 📂 Estructura del Proyecto

```
apps/mobile/
├── App.tsx                      # Entry point con navegación
├── src/
│   ├── screens/
│   │   ├── LoginScreen.tsx           # Pantalla de login
│   │   ├── HomeScreen.tsx            # Dashboard principal
│   │   ├── ActivitiesScreen.tsx      # Lista de actividades
│   │   ├── ActivityDetailScreen.tsx  # Detalle + progreso
│   │   └── ReportsScreen.tsx         # Reportes diarios
│   │
│   ├── services/
│   │   ├── api/
│   │   │   └── client.ts            # Cliente Axios para APIs
│   │   │
│   │   ├── storage/
│   │   │   ├── database.ts          # Configuración WatermelonDB
│   │   │   ├── schema.ts            # Esquema de BD
│   │   │   └── models/
│   │   │       ├── Schedule.ts      # Modelo de cronograma
│   │   │       ├── Activity.ts      # Modelo de actividad
│   │   │       ├── WorkLog.ts       # Modelo de reporte
│   │   │       └── Photo.ts         # Modelo de foto
│   │   │
│   │   └── sync/
│   │       └── syncService.ts       # Servicio de sincronización
│   │
│   ├── components/              # (Futuro) Componentes reutilizables
│   ├── hooks/                   # (Futuro) Custom hooks
│   ├── navigation/              # (Futuro) Configuración de navegación
│   ├── utils/                   # (Futuro) Utilidades
│   └── types/                   # (Futuro) Tipos TypeScript
│
├── package.json
├── app.json                     # Configuración de Expo
├── tsconfig.json
├── babel.config.js
└── README.md
```

---

## 🗄️ Base de Datos Local (WatermelonDB)

### Modelos

#### Schedule (Cronograma)
```typescript
{
  remoteId: string          // ID del servidor
  projectId: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  status: string           // DRAFT, BASELINE, IN_PROGRESS, COMPLETED
  totalDuration: number
  isSynced: boolean       // Está sincronizado con el servidor
}
```

#### Activity (Actividad)
```typescript
{
  remoteId: string
  scheduleId: string
  code: string            // "ACT-001"
  name: string
  description: string
  duration: number

  // CPM fields
  earlyStart: number
  earlyFinish: number
  lateStart: number
  lateFinish: number
  totalFloat: number
  isCritical: boolean

  // Progress tracking
  percentComplete: number      // 0-100
  actualStart: Date
  actualFinish: Date

  // Integration
  spaceId: string
  budgetItemId: string

  // Sync control
  isSynced: boolean
  pendingSync: boolean    // Tiene cambios locales sin sincronizar
}
```

#### WorkLog (Reporte Diario)
```typescript
{
  remoteId: string
  activityId: string
  logDate: Date
  workDone: string        // Descripción del trabajo
  hoursWorked: number
  workersCount: number
  progressPercentage: number
  notes: string
  weather: string        // Sunny, Rainy, Cloudy
  reportedBy: string     // User ID
  isSynced: boolean
}
```

#### Photo (Foto)
```typescript
{
  remoteId: string
  activityId: string
  localUri: string       // Ruta local del archivo
  remoteUrl: string      // URL en S3 (después de sync)
  caption: string
  takenBy: string
  takenAt: Date
  isSynced: boolean
}
```

---

## 🔄 Sincronización

### Flujo de Sincronización

```
┌──────────────┐
│ Usuario hace │
│  cambios     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ Guarda en DB local   │
│ pendingSync = true   │
│ isSynced = false     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Usuario presiona     │
│ "Sincronizar" o      │
│ sync automático      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ SyncService detecta  │
│ cambios pendientes   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Envía al servidor    │
│ (Schedule Service)   │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Marca isSynced=true  │
│ pendingSync=false    │
└──────────────────────┘
```

### Sincronización Automática

El `SyncService` maneja:
1. **Detección de red**: Verifica si hay internet
2. **Sync de actividades**: Actualiza `percentComplete`, `actualStart`, `actualFinish`
3. **Sync de reportes**: Envía work logs al servidor
4. **Sync de fotos**: Sube imágenes a S3

### Uso Programático

```typescript
import SyncService from '@/services/sync/syncService';

// Verificar si está online
const online = await SyncService.isOnline();

// Sincronizar manualmente
const result = await SyncService.sync(scheduleId);

if (result.status === 'success') {
  console.log('Sincronizado:', result.syncedItems);
} else {
  console.error('Error:', result.message);
}

// Escuchar eventos de sync
const unsubscribe = SyncService.onSyncStatusChange((result) => {
  console.log('Sync status:', result.status);
  console.log('Message:', result.message);
});

// Cleanup
unsubscribe();
```

### Descarga de Cronogramas

```typescript
// Descargar cronograma desde el servidor
await SyncService.downloadSchedule(scheduleId);

// Esto descarga:
// - El cronograma completo
// - Todas las actividades
// - Valores CPM calculados
// - Guarda todo en la BD local
```

---

## 📱 Pantallas Principales

### 1. Login Screen

**Credenciales Demo**:
- Email: `demo@construccion.com`
- Password: `demo123`

Utiliza SecureStore para guardar el token de autenticación de forma segura.

### 2. Home Screen (Dashboard)

**Estadísticas**:
- Total de actividades
- Actividades en progreso (0% < progress < 100%)
- Actividades completadas (progress = 100%)
- Actividades críticas (isCritical = true)

**Indicadores**:
- 🟢 En línea / 🔴 Sin conexión
- Botón de sincronización (solo si está online)

**Acciones Rápidas**:
- Ver Actividades
- Reportes Diarios
- Tomar Foto (próximamente)

### 3. Activities Screen

**Funcionalidades**:
- **Búsqueda**: Por código o nombre de actividad
- **Filtros**:
  - Todas
  - En Progreso
  - Críticas
- **Ordenamiento**: Por Early Start (CPM)
- **Indicadores**:
  - Badge "CRÍTICA" para actividades en ruta crítica
  - Barra de progreso visual
  - Advertencia de "Pendiente de sincronizar"

### 4. Activity Detail Screen

**Secciones**:

**A. Header**:
- Código de actividad
- Badge "CRÍTICA" (si aplica)
- Nombre y descripción
- Fechas de inicio/fin reales (si están disponibles)

**B. Avance de Obra**:
- Progreso actual con barra visual
- Slider para actualizar progreso (0-100%, pasos de 5%)
- Botón "Actualizar Progreso"
- Actualiza automáticamente `actualStart` si es 0 → >0
- Actualiza automáticamente `actualFinish` si progreso llega a 100%

**C. Información CPM**:
- Duración planificada
- Early Start (ES)
- Early Finish (EF)
- Holgura Total (Total Float)
- Advertencia especial si es actividad crítica

**D. Acciones**:
- ▶️ Iniciar Actividad (si no ha iniciado)
- 📝 Agregar Reporte Diario
- 📷 Tomar Foto

### 5. Reports Screen

**Funcionalidades**:
- Lista de work logs ordenados por fecha (más reciente primero)
- Botón "+ Nuevo" para crear reporte
- Cards mostrando:
  - Fecha del reporte
  - Clima con emoji (☀️ Sunny, 🌧️ Rainy, ☁️ Cloudy)
  - Descripción del trabajo realizado
  - Estadísticas: Horas trabajadas, N° trabajadores, % avance
  - Notas adicionales (si hay)
  - Badge "Pendiente de sincronizar"

---

## 🔌 Integración con Backend

### Schedule Service API

**Base URL**: `http://localhost:3005/api/v1`

#### Get Schedules
```http
GET /schedules?projectId=xxx
Authorization: Bearer {token}

Response:
[{
  id: "uuid",
  projectId: "uuid",
  name: "Cronograma Casa",
  status: "IN_PROGRESS",
  ...
}]
```

#### Get Schedule with Activities
```http
GET /schedules/:scheduleId
Authorization: Bearer {token}

Response:
{
  id: "uuid",
  name: "Cronograma Casa",
  activities: [{
    id: "uuid",
    code: "ACT-001",
    name: "Excavación",
    percentComplete: 50,
    isCritical: true,
    ...
  }]
}
```

#### Update Activity Progress
```http
PUT /schedules/:scheduleId/activities/:activityId
Authorization: Bearer {token}
Content-Type: application/json

{
  "percentComplete": 75,
  "actualStart": "2025-01-15T08:00:00Z",
  "actualFinish": null
}

Response:
{
  id: "uuid",
  percentComplete: 75,
  actualStart: "2025-01-15T08:00:00Z",
  ...
}
```

---

## 🛠️ Desarrollo

### Hot Reload

Expo tiene hot reload automático. Los cambios en el código se reflejan inmediatamente en el dispositivo/emulador.

### Debugging

```bash
# Abrir React Native Debugger
npm run start

# Presionar 'j' para abrir debugger
# Presionar 'm' para toggle menu en el dispositivo
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

---

## 📦 Build para Producción

### Android APK

```bash
# Build APK de desarrollo
expo build:android -t apk

# Build AAB para Google Play
expo build:android -t app-bundle
```

### iOS IPA

```bash
# Build para App Store
expo build:ios -t archive

# Build para testing interno
expo build:ios -t simulator
```

### EAS Build (Recomendado)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar proyecto
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

---

## 🧪 Testing

### Testing Manual

1. **Offline Mode**:
   - Activa modo avión
   - Intenta actualizar progreso
   - Verifica badge "Pendiente de sincronizar"
   - Desactiva modo avión
   - Presiona "Sincronizar"
   - Verifica que el badge desaparezca

2. **Progress Update**:
   - Ve a Activity Detail
   - Mueve el slider de progreso
   - Presiona "Actualizar Progreso"
   - Ve a Activities list
   - Verifica que el progreso se actualice

3. **Sync Flow**:
   - Con internet, descarga un cronograma
   - Sin internet, actualiza 3 actividades
   - Reconecta internet
   - Sincroniza
   - Verifica en el backend que los cambios se guardaron

### Unit Tests (Futuro)

```bash
npm run test
```

---

## 🚨 Troubleshooting

### Error: "Can't connect to server"

**Problema**: El dispositivo no puede conectar con el Schedule Service.

**Solución**:
1. Verifica que Schedule Service esté corriendo en `http://localhost:3005`
2. Si usas dispositivo físico, cambia `localhost` por tu IP local:
   ```env
   EXPO_PUBLIC_SCHEDULE_API_URL=http://192.168.1.100:3005
   ```
3. Asegúrate que el firewall permita conexiones al puerto 3005

### Error: "Database not initialized"

**Problema**: WatermelonDB no se inicializó correctamente.

**Solución**:
1. Limpia cache de Expo: `expo start -c`
2. Desinstala la app del dispositivo y vuelve a instalar
3. Verifica que `expo-sqlite` esté instalado correctamente

### Fotos no se suben

**Problema**: Las fotos quedan en "Pendiente de sincronizar".

**Solución**:
1. Implementar endpoint en backend para subir fotos (actualmente es placeholder)
2. Configurar permisos de cámara en `app.json`
3. Verificar que el tamaño de la foto no exceda el límite del servidor

### App se crashea al abrir Activity Detail

**Problema**: Missing dependency `@react-native-community/slider`.

**Solución**:
```bash
npm install @react-native-community/slider
```

---

## 🔮 Próximas Funcionalidades

### Corto Plazo
- [ ] **Foto Capture**: Implementar toma de fotos con cámara
- [ ] **Add Work Log Screen**: Formulario para crear reportes diarios
- [ ] **Push Notifications**: Alertas de actividades críticas
- [ ] **Offline Queue Manager**: UI para ver pending syncs
- [ ] **Conflict Resolution**: Manejo de conflictos de sync

### Mediano Plazo
- [ ] **Resource Assignment**: Ver y reportar uso de recursos
- [ ] **QR Code Scanner**: Escanear materiales/equipos
- [ ] **Voice Notes**: Grabar notas de voz para reportes
- [ ] **Signature Capture**: Firmas digitales en reportes
- [ ] **GPS Tracking**: Ubicación automática de fotos

### Largo Plazo
- [ ] **AR Measurements**: Mediciones con realidad aumentada
- [ ] **BIM Viewer**: Visualizar modelos 3D en móvil
- [ ] **ML Photo Analysis**: Detectar progreso automáticamente desde fotos
- [ ] **Team Chat**: Mensajería en tiempo real
- [ ] **Offline Maps**: Mapas del sitio sin conexión

---

## 📊 Métricas de Performance

### Targets
- **App Size**: < 50 MB
- **Initial Load**: < 3 segundos
- **Activity List Load**: < 500ms
- **DB Query Time**: < 100ms
- **Sync Time** (100 activities): < 5 segundos
- **Photo Upload**: < 10 segundos

---

## 🔐 Seguridad

### Storage
- Tokens guardados en **SecureStore** (encrypted)
- Base de datos local **no encriptada** (WatermelonDB plain SQLite)
  - Para encriptar: Usar SQLCipher

### API
- Todas las requests incluyen `Authorization: Bearer {token}`
- Tokens con expiración (JWT)
- Refresh token para renovar sesión

### Permisos
- Cámara: Solo cuando el usuario toma foto
- Storage: Para guardar fotos localmente
- Network: Para detectar conectividad

---

## 📚 Referencias

### Documentación
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [WatermelonDB](https://watermelondb.dev/)
- [React Native](https://reactnative.dev/)

### Librerías Clave
- `@nozbe/watermelondb`: Offline database
- `@react-navigation/native`: Navegación
- `expo-camera`: Cámara
- `expo-secure-store`: Storage seguro
- `axios`: HTTP client
- `date-fns`: Manejo de fechas

---

## 🤝 Contribución

Para contribuir al Execution Service:
1. Seguir estructura de carpetas existente
2. Usar TypeScript con tipos estrictos
3. Documentar funciones complejas
4. Mantener offline-first architecture
5. Probar en Android e iOS

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
**Autor**: Claude Code - Session 7
