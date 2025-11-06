-- ============================================
-- DATOS INICIALES: SISTEMA DE PRECIOS UNITARIOS
-- Migración 002: Insertar catálogos base y recetas
-- ============================================

-- ============================================
-- 1. MATERIALES BASE
-- ============================================
INSERT INTO materiales (clave, nombre, unidad, precio_unitario, factor_merma, categoria, subcategoria) VALUES
-- Materiales de Cimentación
('CEM-001', 'Cemento Portland CPO 30 R', 'ton', 2800.00, 1.05, 'Cemento', 'Cementantes'),
('GRA-001', 'Grava triturada 3/4"', 'm3', 450.00, 1.10, 'Agregados', 'Gruesos'),
('ARE-001', 'Arena de río', 'm3', 380.00, 1.10, 'Agregados', 'Finos'),
('VAR-001', 'Varilla corrugada #3 (3/8")', 'ton', 18500.00, 1.08, 'Acero', 'Varilla'),
('VAR-002', 'Varilla corrugada #4 (1/2")', 'ton', 18000.00, 1.08, 'Acero', 'Varilla'),
('ALA-001', 'Alambre recocido #18', 'kg', 25.00, 1.05, 'Acero', 'Alambre'),

-- Materiales de Albañilería
('TAB-001', 'Tabique rojo recocido 7x14x28 cm', 'pza', 8.50, 1.10, 'Tabique', 'Rojo'),
('TAB-002', 'Block de concreto 15x20x40 cm', 'pza', 14.00, 1.08, 'Block', 'Hueco'),
('CAL-001', 'Cal hidratada', 'ton', 2200.00, 1.05, 'Cal', 'Hidratada'),

-- Materiales de Acabados
('YES-001', 'Yeso blanco', 'ton', 3500.00, 1.10, 'Yeso', 'Acabados'),
('PIN-001', 'Pintura vinílica blanca', 'lt', 65.00, 1.10, 'Pintura', 'Vinílica'),
('AZU-001', 'Azulejo cerámico 20x30 cm', 'm2', 165.00, 1.08, 'Azulejo', 'Cerámico'),
('PIS-001', 'Piso cerámico 40x40 cm', 'm2', 185.00, 1.08, 'Piso', 'Cerámico'),

-- Materiales de Instalaciones
('TUB-001', 'Tubo PVC hidráulico 13mm (1/2")', 'm', 18.00, 1.05, 'PVC', 'Hidráulico'),
('TUB-002', 'Tubo PVC sanitario 100mm (4")', 'm', 95.00, 1.05, 'PVC', 'Sanitario'),
('CAB-001', 'Cable THW calibre 12', 'm', 12.00, 1.10, 'Eléctrico', 'Cableado'),
('CON-001', 'Contacto doble polarizado', 'pza', 35.00, 1.03, 'Eléctrico', 'Contactos')

ON CONFLICT (clave) DO NOTHING;

-- ============================================
-- 2. MANO DE OBRA
-- ============================================
INSERT INTO mano_obra (clave, categoria, especialidad, salario_base, factor_salario_real, region) VALUES
-- Oficiales
('MO-001', 'Oficial', 'Oficial Albañil', 380.00, 1.50, 'Centro'),
('MO-002', 'Oficial', 'Oficial Fierrero', 400.00, 1.50, 'Centro'),
('MO-003', 'Oficial', 'Oficial Plomero', 420.00, 1.50, 'Centro'),
('MO-004', 'Oficial', 'Oficial Electricista', 450.00, 1.50, 'Centro'),
('MO-005', 'Oficial', 'Oficial Yesero', 370.00, 1.50, 'Centro'),
('MO-006', 'Oficial', 'Oficial Pintor', 360.00, 1.50, 'Centro'),

-- Ayudantes
('MO-007', 'Ayudante', 'Ayudante General', 280.00, 1.50, 'Centro'),
('MO-008', 'Ayudante', 'Ayudante Especializado', 300.00, 1.50, 'Centro'),

-- Peones
('MO-009', 'Peón', 'Peón', 260.00, 1.50, 'Centro')

ON CONFLICT (clave) DO NOTHING;

-- ============================================
-- 3. CONCEPTOS BASE (Catálogo)
-- ============================================
INSERT INTO conceptos_base (clave, nombre, descripcion, unidad, partida, subpartida, tipo_obra) VALUES
-- Albañilería
('ALBA-001', 'Muro de tabique rojo recocido', 'Construcción de muro de tabique rojo recocido de 14 cm de espesor, asentado con mortero cemento-cal-arena 1:2:8, incluye: materiales, mano de obra y herramienta.', 'm2', 'Albañilería', 'Muros', 'casa_habitacion'),

('ALBA-002', 'Muro de block de concreto', 'Construcción de muro de block de concreto hueco de 15 cm de espesor, asentado con mortero cemento-arena 1:4, incluye: materiales, mano de obra y herramienta.', 'm2', 'Albañilería', 'Muros', 'casa_habitacion'),

('ALBA-003', 'Aplanado de yeso', 'Aplanado de yeso en muros interiores a plomo y regla, espesor de 1.5 cm, incluye: materiales, mano de obra y herramienta.', 'm2', 'Acabados', 'Aplanados', 'casa_habitacion'),

('ALBA-004', 'Firme de concreto', 'Firme de concreto f''c=150 kg/cm2 de 10 cm de espesor, incluye: materiales, mano de obra, herramienta y equipo.', 'm2', 'Cimentación', 'Firmes', 'casa_habitacion'),

-- Instalaciones
('INST-001', 'Instalación hidráulica PVC', 'Suministro e instalación de tubería PVC hidráulica de 13mm (1/2"), incluye: materiales, accesorios, mano de obra y herramienta.', 'm', 'Instalaciones', 'Hidráulica', 'casa_habitacion'),

('INST-002', 'Instalación sanitaria PVC', 'Suministro e instalación de tubería PVC sanitaria de 100mm (4"), incluye: materiales, accesorios, mano de obra y herramienta.', 'm', 'Instalaciones', 'Sanitaria', 'casa_habitacion'),

('INST-003', 'Instalación eléctrica básica', 'Instalación de circuito eléctrico con cable THW calibre 12, incluye: cableado, contacto, caja, materiales menores, mano de obra y herramienta.', 'salida', 'Instalaciones', 'Eléctrica', 'casa_habitacion'),

-- Acabados
('ACAB-001', 'Pintura vinílica en muros', 'Aplicación de pintura vinílica en muros interiores, 2 manos, incluye: sellador, materiales, mano de obra y herramienta.', 'm2', 'Acabados', 'Pintura', 'casa_habitacion'),

('ACAB-002', 'Colocación de piso cerámico', 'Suministro y colocación de piso cerámico de 40x40 cm, incluye: piso, adhesivo, boquilla, materiales, mano de obra y herramienta.', 'm2', 'Acabados', 'Pisos', 'casa_habitacion'),

('ACAB-003', 'Colocación de azulejo', 'Suministro y colocación de azulejo cerámico de 20x30 cm en muros, incluye: azulejo, adhesivo, boquilla, materiales, mano de obra y herramienta.', 'm2', 'Acabados', 'Azulejos', 'casa_habitacion')

ON CONFLICT (clave) DO NOTHING;

-- ============================================
-- 4. RENDIMIENTOS (Cuadrillas y productividad)
-- ============================================
INSERT INTO rendimientos (actividad, concepto_clave, unidad, cuadrilla, rendimiento, rendimiento_inverso, fuente, region) VALUES
('Construcción de muro de tabique rojo', 'ALBA-001', 'm2',
 '{"Oficial": 1, "Ayudante": 1}'::jsonb,
 4.5, 0.2222, 'BDAU México', 'Centro'),

('Construcción de muro de block', 'ALBA-002', 'm2',
 '{"Oficial": 1, "Ayudante": 1}'::jsonb,
 6.0, 0.1667, 'BDAU México', 'Centro'),

('Aplanado de yeso en muros', 'ALBA-003', 'm2',
 '{"Oficial": 1, "Ayudante": 0.5}'::jsonb,
 15.0, 0.0667, 'BDAU México', 'Centro'),

('Colado de firme de concreto', 'ALBA-004', 'm2',
 '{"Oficial": 1, "Peón": 2}'::jsonb,
 12.0, 0.0833, 'BDAU México', 'Centro'),

('Instalación de tubería hidráulica', 'INST-001', 'm',
 '{"Oficial": 1, "Ayudante": 0.5}'::jsonb,
 20.0, 0.05, 'BDAU México', 'Centro'),

('Instalación de tubería sanitaria', 'INST-002', 'm',
 '{"Oficial": 1, "Ayudante": 0.5}'::jsonb,
 15.0, 0.0667, 'BDAU México', 'Centro'),

('Instalación de circuito eléctrico', 'INST-003', 'salida',
 '{"Oficial": 1, "Ayudante": 0.5}'::jsonb,
 8.0, 0.125, 'BDAU México', 'Centro'),

('Aplicación de pintura vinílica', 'ACAB-001', 'm2',
 '{"Oficial": 1, "Ayudante": 0.5}'::jsonb,
 25.0, 0.04, 'BDAU México', 'Centro'),

('Colocación de piso cerámico', 'ACAB-002', 'm2',
 '{"Oficial": 1, "Ayudante": 0.5}'::jsonb,
 10.0, 0.10, 'BDAU México', 'Centro'),

('Colocación de azulejo en muros', 'ACAB-003', 'm2',
 '{"Oficial": 1, "Ayudante": 0.5}'::jsonb,
 12.0, 0.0833, 'BDAU México', 'Centro');

-- ============================================
-- 5. INSUMOS POR CONCEPTO (Recetas/Explosión)
-- ============================================

-- ALBA-001: Muro de tabique rojo recocido (por m2)
INSERT INTO insumos_concepto (concepto_id, tipo_insumo, insumo_clave, cantidad, notas) VALUES
((SELECT id FROM conceptos_base WHERE clave = 'ALBA-001'), 'material', 'TAB-001', 70, '70 piezas por m2'),
((SELECT id FROM conceptos_base WHERE clave = 'ALBA-001'), 'material', 'CEM-001', 0.012, '12 kg cemento'),
((SELECT id FROM conceptos_base WHERE clave = 'ALBA-001'), 'material', 'CAL-001', 0.008, '8 kg cal'),
((SELECT id FROM conceptos_base WHERE clave = 'ALBA-001'), 'material', 'ARE-001', 0.03, '0.03 m3 arena');

-- ALBA-002: Muro de block de concreto (por m2)
INSERT INTO insumos_concepto (concepto_id, tipo_insumo, insumo_clave, cantidad, notas) VALUES
((SELECT id FROM conceptos_base WHERE clave = 'ALBA-002'), 'material', 'TAB-002', 12.5, '12.5 piezas por m2'),
((SELECT id FROM conceptos_base WHERE clave = 'ALBA-002'), 'material', 'CEM-001', 0.015, '15 kg cemento'),
((SELECT id FROM conceptos_base WHERE clave = 'ALBA-002'), 'material', 'ARE-001', 0.025, '0.025 m3 arena');

-- ALBA-003: Aplanado de yeso (por m2)
INSERT INTO insumos_concepto (concepto_id, tipo_insumo, insumo_clave, cantidad, notas) VALUES
((SELECT id FROM conceptos_base WHERE clave = 'ALBA-003'), 'material', 'YES-001', 0.020, '20 kg yeso por m2');

-- ALBA-004: Firme de concreto (por m2)
INSERT INTO insumos_concepto (concepto_id, tipo_insumo, insumo_clave, cantidad, notas) VALUES
((SELECT id FROM conceptos_base WHERE clave = 'ALBA-004'), 'material', 'CEM-001', 0.030, '30 kg cemento'),
((SELECT id FROM conceptos_base WHERE clave = 'ALBA-004'), 'material', 'GRA-001', 0.05, '0.05 m3 grava'),
((SELECT id FROM conceptos_base WHERE clave = 'ALBA-004'), 'material', 'ARE-001', 0.04, '0.04 m3 arena');

-- INST-001: Instalación hidráulica (por metro)
INSERT INTO insumos_concepto (concepto_id, tipo_insumo, insumo_clave, cantidad, notas) VALUES
((SELECT id FROM conceptos_base WHERE clave = 'INST-001'), 'material', 'TUB-001', 1.05, '1.05 m tubo (incluye merma)');

-- INST-002: Instalación sanitaria (por metro)
INSERT INTO insumos_concepto (concepto_id, tipo_insumo, insumo_clave, cantidad, notas) VALUES
((SELECT id FROM conceptos_base WHERE clave = 'INST-002'), 'material', 'TUB-002', 1.05, '1.05 m tubo (incluye merma)');

-- INST-003: Instalación eléctrica (por salida)
INSERT INTO insumos_concepto (concepto_id, tipo_insumo, insumo_clave, cantidad, notas) VALUES
((SELECT id FROM conceptos_base WHERE clave = 'INST-003'), 'material', 'CAB-001', 15, '15 m cable promedio'),
((SELECT id FROM conceptos_base WHERE clave = 'INST-003'), 'material', 'CON-001', 1, '1 contacto');

-- ACAB-001: Pintura vinílica (por m2)
INSERT INTO insumos_concepto (concepto_id, tipo_insumo, insumo_clave, cantidad, notas) VALUES
((SELECT id FROM conceptos_base WHERE clave = 'ACAB-001'), 'material', 'PIN-001', 0.25, '0.25 lt pintura (2 manos)');

-- ACAB-002: Piso cerámico (por m2)
INSERT INTO insumos_concepto (concepto_id, tipo_insumo, insumo_clave, cantidad, notas) VALUES
((SELECT id FROM conceptos_base WHERE clave = 'ACAB-002'), 'material', 'PIS-001', 1.08, '1.08 m2 piso (incluye merma)'),
((SELECT id FROM conceptos_base WHERE clave = 'ACAB-002'), 'material', 'CEM-001', 0.005, '5 kg adhesivo');

-- ACAB-003: Azulejo en muros (por m2)
INSERT INTO insumos_concepto (concepto_id, tipo_insumo, insumo_clave, cantidad, notas) VALUES
((SELECT id FROM conceptos_base WHERE clave = 'ACAB-003'), 'material', 'AZU-001', 1.08, '1.08 m2 azulejo (incluye merma)'),
((SELECT id FROM conceptos_base WHERE clave = 'ACAB-003'), 'material', 'CEM-001', 0.005, '5 kg adhesivo');

-- ============================================
-- 6. FACTORES DE SOBRECOSTO (Configuraciones predeterminadas)
-- ============================================
INSERT INTO factores_sobrecosto (nombre, tipo_cliente, indirectos_campo, indirectos_oficina, financiamiento, utilidad, cargos_adicionales) VALUES
('Configuración Privado Estándar', 'privado', 5.00, 8.00, 3.00, 12.00, 0.00),
('Configuración Gobierno Federal', 'gobierno', 6.00, 10.00, 2.50, 8.00, 0.00),
('Configuración Alta Competencia', 'privado', 4.00, 6.00, 2.00, 8.00, 0.00),
('Configuración Premium', 'privado', 7.00, 12.00, 4.00, 18.00, 2.00);

-- ============================================
-- 7. HERRAMIENTA Y EQUIPO
-- ============================================
INSERT INTO herramienta_equipo (clave, nombre, tipo, porcentaje_sobre_mo, descripcion) VALUES
('HER-001', 'Herramienta menor albañilería', 'menor', 3.00, 'Palas, picos, cubetas, plomadas, niveles'),
('HER-002', 'Herramienta menor electricista', 'menor', 3.00, 'Pinzas, desarmadores, probadores'),
('HER-003', 'Herramienta menor plomero', 'menor', 3.00, 'Llaves, cortadores, soplete'),
('EQU-001', 'Revolvedora 1 saco', 'equipo', NULL, 'Revolvedora de concreto capacidad 1 saco'),
('EQU-002', 'Vibrador para concreto', 'equipo', NULL, 'Vibrador de inmersión para concreto');

COMMIT;
