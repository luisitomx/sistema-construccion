// ============================================
// TIPOS PARA SISTEMA DE PRECIOS UNITARIOS
// ============================================

export enum TipoCliente {
  PRIVADO = 'privado',
  GOBIERNO = 'gobierno',
}

export interface ConfiguracionProyecto {
  tipoCliente: TipoCliente;
  indirectosCampo: number;
  indirectosOficina: number;
  financiamiento: number;
  utilidad: number;
  cargosAdicionales?: number;
}

export interface AjustesPersonalizados {
  materiales?: { [clave: string]: number };
  rendimiento?: number;
}

export interface CalcularPuRequest {
  conceptoClave: string;
  configuracion: ConfiguracionProyecto;
  ajustesPersonalizados?: AjustesPersonalizados;
}

export interface ConceptoBase {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  unidad: string;
  partida: string;
  subpartida: string;
  tipoObra: string;
  activo: boolean;
}

export interface Material {
  id: number;
  clave: string;
  nombre: string;
  descripcion: string;
  unidad: string;
  precioUnitario: number;
  factorMerma: number;
  categoria: string;
  subcategoria: string;
  proveedor: string;
}

export interface Rendimiento {
  id: number;
  actividad: string;
  conceptoClave: string;
  unidad: string;
  cuadrilla: { [tipo: string]: number };
  rendimiento: number;
  rendimientoInverso: number;
  condiciones: string;
  fuente: string;
  region: string;
}

export interface ConceptoDetalle {
  concepto: ConceptoBase;
  rendimiento: Rendimiento;
  materiales: MaterialDetalle[];
}

export interface MaterialDetalle {
  clave: string;
  nombre: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  factorMerma: number;
}

export interface DesgloseMaterial {
  clave: string;
  nombre: string;
  unidad: string;
  cantidad: number;
  precioUnitario: number;
  factorMerma: number;
  importe: number;
}

export interface DesgloseManoObra {
  tipo: string;
  especialidad: string;
  cantidad: number;
  salarioBase: number;
  factorSalarioReal: number;
  jornadas: number;
  importe: number;
}

export interface DesgloseHerramienta {
  descripcion: string;
  porcentaje: number;
  base: number;
  costo: number;
}

export interface ResumenCostos {
  costoDirecto: number;
  indirectos: {
    porcentaje: number;
    monto: number;
  };
  subtotal: number;
  financiamiento: {
    porcentaje: number;
    monto: number;
  };
  utilidad: {
    porcentaje: number;
    monto: number;
  };
  cargosAdicionales: {
    porcentaje: number;
    monto: number;
  };
  total: number;
}

export interface DesgloseCompleto {
  concepto: {
    clave: string;
    nombre: string;
    unidad: string;
  };
  materiales: DesgloseMaterial[];
  manoObra: DesgloseManoObra[];
  herramienta: DesgloseHerramienta;
  resumen: ResumenCostos;
  configuracion: ConfiguracionProyecto;
  fechaCalculo: string;
}

export interface PrecioUnitarioCalculado {
  id: number;
  concepto: {
    clave: string;
    nombre: string;
    unidad: string;
  };
  costos: {
    materiales: string;
    manoObra: string;
    herramienta: string;
    costoDirecto: string;
    indirectos: string;
    subtotal: string;
    financiamiento: string;
    utilidad: string;
    cargosAdicionales: string;
    precioUnitarioTotal: string;
  };
  desglose: DesgloseCompleto;
}
