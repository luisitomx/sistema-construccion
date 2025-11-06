// ============================================
// API CLIENT - PRECIOS UNITARIOS
// ============================================

import {
  CalcularPuRequest,
  PrecioUnitarioCalculado,
  ConceptoBase,
  ConceptoDetalle,
  Material,
} from '@/types/precios-unitarios';

const API_BASE_URL = process.env.NEXT_PUBLIC_COSTS_API_URL || 'http://localhost:3004';

class PreciosUnitariosAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // ============================================
  // CONCEPTOS
  // ============================================

  async listarConceptos(params?: {
    partida?: string;
    subpartida?: string;
    tipoObra?: string;
    busqueda?: string;
  }): Promise<ConceptoBase[]> {
    const queryParams = new URLSearchParams();

    if (params?.partida) queryParams.append('partida', params.partida);
    if (params?.subpartida) queryParams.append('subpartida', params.subpartida);
    if (params?.tipoObra) queryParams.append('tipoObra', params.tipoObra);
    if (params?.busqueda) queryParams.append('busqueda', params.busqueda);

    const url = `${this.baseUrl}/precios-unitarios/conceptos${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error al listar conceptos: ${response.statusText}`);
    }

    return response.json();
  }

  async obtenerConcepto(clave: string): Promise<ConceptoDetalle> {
    const response = await fetch(`${this.baseUrl}/precios-unitarios/conceptos/${clave}`);

    if (!response.ok) {
      throw new Error(`Error al obtener concepto: ${response.statusText}`);
    }

    return response.json();
  }

  async obtenerPartidas(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/precios-unitarios/conceptos/partidas`);

    if (!response.ok) {
      throw new Error(`Error al obtener partidas: ${response.statusText}`);
    }

    return response.json();
  }

  async obtenerSubpartidas(partida: string): Promise<string[]> {
    const response = await fetch(
      `${this.baseUrl}/precios-unitarios/conceptos/partidas/${encodeURIComponent(partida)}/subpartidas`
    );

    if (!response.ok) {
      throw new Error(`Error al obtener subpartidas: ${response.statusText}`);
    }

    return response.json();
  }

  // ============================================
  // MATERIALES
  // ============================================

  async listarMateriales(params?: {
    categoria?: string;
    subcategoria?: string;
  }): Promise<Material[]> {
    const queryParams = new URLSearchParams();

    if (params?.categoria) queryParams.append('categoria', params.categoria);
    if (params?.subcategoria) queryParams.append('subcategoria', params.subcategoria);

    const url = `${this.baseUrl}/precios-unitarios/materiales${
      queryParams.toString() ? '?' + queryParams.toString() : ''
    }`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error al listar materiales: ${response.statusText}`);
    }

    return response.json();
  }

  async obtenerMaterial(clave: string): Promise<Material> {
    const response = await fetch(`${this.baseUrl}/precios-unitarios/materiales/${clave}`);

    if (!response.ok) {
      throw new Error(`Error al obtener material: ${response.statusText}`);
    }

    return response.json();
  }

  async obtenerCategoriasMateriales(): Promise<string[]> {
    const response = await fetch(`${this.baseUrl}/precios-unitarios/materiales/categorias`);

    if (!response.ok) {
      throw new Error(`Error al obtener categorías: ${response.statusText}`);
    }

    return response.json();
  }

  // ============================================
  // CÁLCULO DE PU
  // ============================================

  async calcularPrecioUnitario(data: CalcularPuRequest): Promise<PrecioUnitarioCalculado> {
    const response = await fetch(`${this.baseUrl}/precios-unitarios/calcular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Error al calcular PU: ${response.statusText}`
      );
    }

    return response.json();
  }
}

// Singleton instance
export const preciosUnitariosAPI = new PreciosUnitariosAPI();

// Export class for testing
export { PreciosUnitariosAPI };
