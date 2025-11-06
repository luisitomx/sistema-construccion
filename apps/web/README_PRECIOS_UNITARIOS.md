# Constructor de Precios Unitarios - Frontend

Sistema de construcción interactiva de Precios Unitarios con wizard paso a paso.

## 📋 Descripción

Interfaz web intuitiva que permite a los usuarios calcular precios unitarios de construcción de forma dinámica mediante un proceso guiado de 4 pasos:

1. **Configuración** - Definir factores de sobrecosto del proyecto
2. **Concepto** - Seleccionar el concepto constructivo
3. **Personalizar** - Ajustar cantidades de materiales y rendimientos (opcional)
4. **Resultado** - Visualizar el desglose completo del precio calculado

## 🚀 Inicio Rápido

### 1. Configurar Variables de Entorno

```bash
cd apps/web
cp .env.example .env.local
```

Editar `.env.local`:

```env
NEXT_PUBLIC_COSTS_API_URL=http://localhost:3004
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Iniciar Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### 4. Navegar al Constructor

Accede a: `http://localhost:3000/precios-unitarios`

O usa el link "Precios Unitarios" en la barra de navegación.

## 📁 Estructura de Archivos

```
apps/web/
├── app/
│   └── precios-unitarios/
│       └── page.tsx                         # Página principal del wizard
├── components/
│   └── precios-unitarios/
│       ├── ConfiguracionStep.tsx            # Step 1: Configuración
│       ├── SeleccionConceptoStep.tsx        # Step 2: Selección de concepto
│       ├── PersonalizacionStep.tsx          # Step 3: Personalización
│       └── ResultadoStep.tsx                # Step 4: Resultado
├── lib/
│   └── api/
│       └── precios-unitarios.ts             # Cliente API REST
├── types/
│   └── precios-unitarios.ts                 # Tipos TypeScript
└── components/layout/
    └── navbar.tsx                           # Navbar (actualizada con link)
```

## 🎨 Componentes

### 1. ConfiguracionStep

Primer paso donde el usuario configura los factores de sobrecosto.

**Features:**
- ✅ 3 presets predefinidos (Privado Estándar, Gobierno, Alta Competencia)
- ✅ Inputs validados para todos los factores
- ✅ Calculadora de factor total en tiempo real
- ✅ Tooltips con valores típicos

**Props:**
```typescript
{
  configuracion: ConfiguracionProyecto;
  onChange: (config: ConfiguracionProyecto) => void;
  onNext: () => void;
}
```

### 2. SeleccionConceptoStep

Segundo paso para seleccionar el concepto constructivo.

**Features:**
- ✅ Lista de conceptos con filtros por partida
- ✅ Búsqueda full-text
- ✅ Tarjetas de concepto con información clave
- ✅ Indicador visual de concepto seleccionado
- ✅ Loading states y error handling

**Props:**
```typescript
{
  conceptoSeleccionado: ConceptoDetalle | null;
  onSelect: (concepto: ConceptoDetalle) => void;
  onNext: () => void;
  onBack: () => void;
}
```

### 3. PersonalizacionStep

Tercer paso para ajustar cantidades (opcional).

**Features:**
- ✅ Ajuste individual de cantidades de materiales
- ✅ Modificación de rendimiento de cuadrilla
- ✅ Indicadores visuales de valores modificados
- ✅ Cálculo de porcentaje de cambio
- ✅ Botones de reset individuales y global

**Props:**
```typescript
{
  concepto: ConceptoDetalle;
  ajustes: AjustesPersonalizados;
  onChange: (ajustes: AjustesPersonalizados) => void;
  onNext: () => void;
  onBack: () => void;
}
```

### 4. ResultadoStep

Cuarto paso mostrando el resultado completo.

**Features:**
- ✅ Precio total destacado
- ✅ Desglose detallado de materiales, MO, herramienta
- ✅ Cálculo de indirectos y cargos
- ✅ Configuración aplicada visible
- ✅ Botones de impresión y descarga JSON
- ✅ Opción de nuevo cálculo

**Props:**
```typescript
{
  resultado: PrecioUnitarioCalculado;
  onBack: () => void;
  onNuevoCalculo: () => void;
}
```

## 🔌 Cliente API

### PreciosUnitariosAPI

Cliente singleton para comunicación con el backend.

**Métodos principales:**

```typescript
// Listar conceptos
await preciosUnitariosAPI.listarConceptos({
  partida: 'Albañilería',
  busqueda: 'muro'
});

// Obtener detalle de concepto
await preciosUnitariosAPI.obtenerConcepto('ALBA-001');

// Calcular precio unitario
await preciosUnitariosAPI.calcularPrecioUnitario({
  conceptoClave: 'ALBA-001',
  configuracion: {...},
  ajustesPersonalizados: {...}
});

// Listar materiales
await preciosUnitariosAPI.listarMateriales({
  categoria: 'Cemento'
});
```

## 📊 Flujo de Datos

```
Usuario Input
    ↓
[Step 1] ConfiguracionStep
    ├─ configuracion State
    ↓
[Step 2] SeleccionConceptoStep
    ├─ GET /precios-unitarios/conceptos
    ├─ GET /precios-unitarios/conceptos/:clave
    ├─ conceptoSeleccionado State
    ↓
[Step 3] PersonalizacionStep
    ├─ ajustesPersonalizados State
    ↓
[Step 4] Trigger Calculation
    ├─ POST /precios-unitarios/calcular
    ↓
[Step 5] ResultadoStep
    ├─ resultado State
    └─ Display breakdown
```

## 🎯 Ejemplo de Uso

```typescript
// 1. Usuario configura factores
const configuracion = {
  tipoCliente: 'privado',
  indirectosCampo: 5,
  indirectosOficina: 8,
  financiamiento: 3,
  utilidad: 12,
  cargosAdicionales: 0
};

// 2. Usuario selecciona concepto
const concepto = await preciosUnitariosAPI.obtenerConcepto('ALBA-001');

// 3. Usuario ajusta cantidades (opcional)
const ajustes = {
  materiales: {
    'CEM-001': 0.015  // Ajustar cantidad de cemento
  },
  rendimiento: 5.0     // Ajustar rendimiento
};

// 4. Calcular PU
const resultado = await preciosUnitariosAPI.calcularPrecioUnitario({
  conceptoClave: 'ALBA-001',
  configuracion,
  ajustesPersonalizados: ajustes
});

// 5. Resultado
console.log(resultado.costos.precioUnitarioTotal); // "$1,019.00"
```

## 🎨 Diseño y UX

### Colores

- **Primario (Blue)**: `bg-blue-600`, `text-blue-600` - Acciones principales
- **Éxito (Green)**: `bg-green-600`, `text-green-600` - Confirmaciones
- **Advertencia (Yellow)**: `bg-yellow-400`, `text-yellow-700` - Valores modificados
- **Error (Red)**: `bg-red-600`, `text-red-600` - Errores
- **Neutro (Gray)**: Texto y backgrounds

### Responsividad

- ✅ **Desktop** (>= 1024px): Grid de 3 columnas, navegación horizontal
- ✅ **Tablet** (768px - 1023px): Grid de 2 columnas
- ✅ **Mobile** (< 768px): Columna única, menú hamburguesa

### Accesibilidad

- ✅ Labels para todos los inputs
- ✅ ARIA labels en botones de iconos
- ✅ Focus states visibles
- ✅ Contraste WCAG AAA
- ✅ Navegación por teclado

## 🧪 Testing

### Pruebas Manuales

1. **Test de Configuración**
   - Aplicar cada preset y verificar valores
   - Modificar factores manualmente
   - Verificar cálculo de factor total

2. **Test de Selección**
   - Filtrar por partida
   - Buscar por texto
   - Seleccionar diferentes conceptos

3. **Test de Personalización**
   - Modificar cantidades de materiales
   - Modificar rendimiento
   - Usar botones de reset

4. **Test de Cálculo**
   - Calcular PU con valores estándar
   - Calcular PU con ajustes
   - Verificar desglose completo

5. **Test de Descarga**
   - Imprimir resultado
   - Descargar JSON

### Pruebas de Integración

```bash
# Requisitos:
# - Backend corriendo en http://localhost:3004
# - Base de datos con datos de prueba

# 1. Verificar listado de conceptos
curl http://localhost:3004/precios-unitarios/conceptos

# 2. Verificar cálculo de PU
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

## 🐛 Troubleshooting

### Error: "Failed to fetch"

**Causa**: Backend no está corriendo o URL incorrecta

**Solución**:
```bash
# 1. Verificar que el backend esté corriendo
cd services/costs
npm run dev

# 2. Verificar la variable de entorno
cat apps/web/.env.local
# Debe contener: NEXT_PUBLIC_COSTS_API_URL=http://localhost:3004
```

### Error: "Concepto no encontrado"

**Causa**: Base de datos sin datos de prueba

**Solución**:
```bash
cd services/costs
npm run migrate
```

### Error: "Cannot read property 'concepto'"

**Causa**: Estado de concepto es null cuando se intenta acceder

**Solución**: Verificar que el usuario seleccione un concepto antes de avanzar al Step 3

## 📱 Capturas de Pantalla

### Step 1: Configuración
```
┌─────────────────────────────────────────────┐
│ Configuración del Proyecto                  │
├─────────────────────────────────────────────┤
│ [Privado Estándar] [Gobierno] [Alta Comp.] │
│                                             │
│ Tipo Cliente:    [Privado ▼]               │
│ Indirectos Campo:  [ 5.0% ]                │
│ Indirectos Oficina: [ 8.0% ]               │
│ Financiamiento:    [ 3.0% ]                │
│ Utilidad:          [12.0% ]                │
│                                             │
│ Factor Total: ~1.303x                       │
│                                             │
│                             [Siguiente →]    │
└─────────────────────────────────────────────┘
```

### Step 2: Selección de Concepto
```
┌─────────────────────────────────────────────┐
│ Selecciona un Concepto                      │
├─────────────────────────────────────────────┤
│ Partida: [Todas ▼]  Buscar: [_________🔍]   │
│                                             │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│ │ALBA-001 │ │ALBA-002 │ │ALBA-003 │       │
│ │Muro tab.│ │Muro blk.│ │Aplanado │       │
│ │ [m²]    │ │ [m²]    │ │ [m²]    │       │
│ └─────────┘ └─────────┘ └─────────┘       │
│                                             │
│ [← Atrás]                  [Siguiente →]    │
└─────────────────────────────────────────────┘
```

### Step 4: Resultado
```
┌─────────────────────────────────────────────┐
│ ✓ ¡Precio Unitario Calculado!     🖨️ 📥    │
├─────────────────────────────────────────────┤
│                                             │
│      PRECIO UNITARIO TOTAL                  │
│            $1,019.00                        │
│            por m²                           │
│                                             │
│ Materiales:       $650.00                  │
│ Mano de Obra:     $130.00                  │
│ Herramienta:       $4.00                   │
│ ─────────────────────────                   │
│ Costo Directo:    $784.00                  │
│ Indirectos:       $102.00                  │
│ Financiamiento:    $27.00                  │
│ Utilidad:         $106.00                  │
│                                             │
│ [← Modificar]           [Nuevo Cálculo]     │
└─────────────────────────────────────────────┘
```

## 🔜 Próximas Mejoras

- [ ] Guardar cálculos en historial
- [ ] Exportar a PDF con formato profesional
- [ ] Comparar múltiples configuraciones
- [ ] Gráficas de distribución de costos
- [ ] Calculadora de cantidad para proyectos
- [ ] Integración con módulo de Presupuestos

## 📚 Referencias

- [Next.js 14 Documentation](https://nextjs.org/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Lucide Icons](https://lucide.dev/)

---

**Mantenedor**: Sistema de Construcción
**Última Actualización**: 2025-11-06
