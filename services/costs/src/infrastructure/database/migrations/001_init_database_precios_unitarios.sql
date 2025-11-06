-- ============================================
-- SISTEMA DINÁMICO DE PRECIOS UNITARIOS
-- Migración 001: Crear tablas base
-- ============================================

-- 1. TABLA: Materiales (extendida con campos para PU dinámico)
CREATE TABLE IF NOT EXISTS materiales (
  id SERIAL PRIMARY KEY,
  clave VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT,
  unidad VARCHAR(10) NOT NULL,
  precio_unitario DECIMAL(10, 2) NOT NULL,
  factor_merma DECIMAL(4, 3) DEFAULT 1.05,
  categoria VARCHAR(50),
  subcategoria VARCHAR(50),
  proveedor VARCHAR(100),
  fecha_actualizacion DATE DEFAULT CURRENT_DATE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABLA: Mano de Obra
CREATE TABLE IF NOT EXISTS mano_obra (
  id SERIAL PRIMARY KEY,
  clave VARCHAR(20) UNIQUE NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  especialidad VARCHAR(100) NOT NULL,
  salario_base DECIMAL(10, 2) NOT NULL,
  factor_salario_real DECIMAL(4, 3) DEFAULT 1.50,
  prestaciones JSONB,
  region VARCHAR(50),
  fecha_actualizacion DATE DEFAULT CURRENT_DATE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABLA: Rendimientos
CREATE TABLE IF NOT EXISTS rendimientos (
  id SERIAL PRIMARY KEY,
  actividad VARCHAR(200) NOT NULL,
  concepto_clave VARCHAR(20),
  unidad VARCHAR(10) NOT NULL,
  cuadrilla JSONB NOT NULL,
  rendimiento DECIMAL(8, 4) NOT NULL,
  rendimiento_inverso DECIMAL(8, 6),
  condiciones TEXT,
  fuente VARCHAR(100),
  region VARCHAR(50),
  fecha_actualizacion DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABLA: Herramienta y Equipo
CREATE TABLE IF NOT EXISTS herramienta_equipo (
  id SERIAL PRIMARY KEY,
  clave VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  tipo VARCHAR(50),
  costo_horario DECIMAL(10, 2),
  porcentaje_sobre_mo DECIMAL(4, 2) DEFAULT 3.00,
  vida_util_horas INTEGER,
  descripcion TEXT,
  fecha_actualizacion DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLA: Conceptos Base (Catálogo de conceptos)
CREATE TABLE IF NOT EXISTS conceptos_base (
  id SERIAL PRIMARY KEY,
  clave VARCHAR(20) UNIQUE NOT NULL,
  nombre VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  unidad VARCHAR(10) NOT NULL,
  partida VARCHAR(100),
  subpartida VARCHAR(100),
  tipo_obra VARCHAR(50) DEFAULT 'casa_habitacion',
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABLA: Insumos por Concepto (Recetas)
CREATE TABLE IF NOT EXISTS insumos_concepto (
  id SERIAL PRIMARY KEY,
  concepto_id INTEGER NOT NULL REFERENCES conceptos_base(id) ON DELETE CASCADE,
  tipo_insumo VARCHAR(20) NOT NULL, -- 'material', 'mano_obra', 'herramienta', 'auxiliar'
  insumo_clave VARCHAR(20) NOT NULL,
  cantidad DECIMAL(10, 4) NOT NULL,
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABLA: Factores de Sobrecosto
CREATE TABLE IF NOT EXISTS factores_sobrecosto (
  id SERIAL PRIMARY KEY,
  proyecto_id INTEGER,
  nombre VARCHAR(100) NOT NULL,
  tipo_cliente VARCHAR(50) NOT NULL, -- 'privado', 'gobierno'
  indirectos_campo DECIMAL(5, 2) DEFAULT 5.00,
  indirectos_oficina DECIMAL(5, 2) DEFAULT 8.00,
  financiamiento DECIMAL(5, 2) DEFAULT 3.00,
  utilidad DECIMAL(5, 2) DEFAULT 12.00,
  cargos_adicionales DECIMAL(5, 2) DEFAULT 0.00,
  fecha_vigencia DATE DEFAULT CURRENT_DATE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABLA: Precios Unitarios Calculados
CREATE TABLE IF NOT EXISTS precios_unitarios_calculados (
  id SERIAL PRIMARY KEY,
  proyecto_id INTEGER,
  concepto_id INTEGER NOT NULL REFERENCES conceptos_base(id),
  costo_materiales DECIMAL(12, 2) NOT NULL,
  costo_mano_obra DECIMAL(12, 2) NOT NULL,
  costo_herramienta DECIMAL(12, 2) NOT NULL,
  costo_auxiliares DECIMAL(12, 2) DEFAULT 0.00,
  costo_directo DECIMAL(12, 2) NOT NULL,
  indirectos DECIMAL(12, 2) NOT NULL,
  financiamiento DECIMAL(12, 2) NOT NULL,
  utilidad DECIMAL(12, 2) NOT NULL,
  cargos_adicionales DECIMAL(12, 2) DEFAULT 0.00,
  precio_unitario_total DECIMAL(12, 2) NOT NULL,
  desglose_json JSONB NOT NULL,
  fecha_calculo TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  calculado_por INTEGER,
  notas TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_materiales_categoria ON materiales(categoria);
CREATE INDEX IF NOT EXISTS idx_materiales_activo ON materiales(activo);
CREATE INDEX IF NOT EXISTS idx_mano_obra_especialidad ON mano_obra(especialidad);
CREATE INDEX IF NOT EXISTS idx_rendimientos_concepto ON rendimientos(concepto_clave);
CREATE INDEX IF NOT EXISTS idx_conceptos_base_partida ON conceptos_base(partida);
CREATE INDEX IF NOT EXISTS idx_conceptos_base_tipo_obra ON conceptos_base(tipo_obra);
CREATE INDEX IF NOT EXISTS idx_insumos_concepto_id ON insumos_concepto(concepto_id);
CREATE INDEX IF NOT EXISTS idx_insumos_tipo ON insumos_concepto(tipo_insumo);
CREATE INDEX IF NOT EXISTS idx_factores_tipo_cliente ON factores_sobrecosto(tipo_cliente);
CREATE INDEX IF NOT EXISTS idx_pu_calc_concepto ON precios_unitarios_calculados(concepto_id);
CREATE INDEX IF NOT EXISTS idx_pu_calc_proyecto ON precios_unitarios_calculados(proyecto_id);

-- Triggers para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_materiales_updated_at BEFORE UPDATE ON materiales
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mano_obra_updated_at BEFORE UPDATE ON mano_obra
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conceptos_base_updated_at BEFORE UPDATE ON conceptos_base
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_insumos_concepto_updated_at BEFORE UPDATE ON insumos_concepto
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
