'use client';

import { useState, useEffect } from 'react';
import { ConceptoBase, ConceptoDetalle } from '@/types/precios-unitarios';
import { preciosUnitariosAPI } from '@/lib/api/precios-unitarios';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface SeleccionConceptoStepProps {
  conceptoSeleccionado: ConceptoDetalle | null;
  onSelect: (concepto: ConceptoDetalle) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SeleccionConceptoStep({
  conceptoSeleccionado,
  onSelect,
  onNext,
  onBack,
}: SeleccionConceptoStepProps) {
  const [conceptos, setConceptos] = useState<ConceptoBase[]>([]);
  const [partidas, setPartidas] = useState<string[]>([]);
  const [filtroPartida, setFiltroPartida] = useState<string>('');
  const [busqueda, setBusqueda] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [loadingDetalle, setLoadingDetalle] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarPartidas();
    cargarConceptos();
  }, []);

  useEffect(() => {
    cargarConceptos();
  }, [filtroPartida, busqueda]);

  const cargarPartidas = async () => {
    try {
      const data = await preciosUnitariosAPI.obtenerPartidas();
      setPartidas(data);
    } catch (err) {
      console.error('Error al cargar partidas:', err);
    }
  };

  const cargarConceptos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await preciosUnitariosAPI.listarConceptos({
        partida: filtroPartida || undefined,
        busqueda: busqueda || undefined,
      });
      setConceptos(data);
    } catch (err) {
      setError('Error al cargar conceptos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectConcepto = async (concepto: ConceptoBase) => {
    try {
      setLoadingDetalle(true);
      const detalle = await preciosUnitariosAPI.obtenerConcepto(concepto.clave);
      onSelect(detalle);
    } catch (err) {
      setError('Error al cargar detalle del concepto');
      console.error(err);
    } finally {
      setLoadingDetalle(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Selecciona un Concepto</h2>
        <p className="mt-2 text-sm text-gray-600">
          Elige el concepto constructivo para calcular su precio unitario
        </p>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Filtro por Partida */}
        <div>
          <label htmlFor="partida" className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Partida
          </label>
          <select
            id="partida"
            value={filtroPartida}
            onChange={(e) => setFiltroPartida(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Todas las partidas</option>
            {partidas.map((partida) => (
              <option key={partida} value={partida}>
                {partida}
              </option>
            ))}
          </select>
        </div>

        {/* Búsqueda */}
        <div>
          <label htmlFor="busqueda" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="busqueda"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por nombre o descripción..."
              className="block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
      </div>

      {/* Concepto Seleccionado */}
      {conceptoSeleccionado && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-green-800">
                Concepto seleccionado: {conceptoSeleccionado.concepto.clave}
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p className="font-medium">{conceptoSeleccionado.concepto.nombre}</p>
                <p className="text-xs mt-1">{conceptoSeleccionado.concepto.descripcion}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="font-medium">Unidad:</span> {conceptoSeleccionado.concepto.unidad}
                  </div>
                  <div>
                    <span className="font-medium">Rendimiento:</span> {conceptoSeleccionado.rendimiento.rendimiento} {conceptoSeleccionado.concepto.unidad}/día
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lista de Conceptos */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Cargando conceptos...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      ) : conceptos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-gray-500">No se encontraron conceptos con los filtros aplicados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {conceptos.map((concepto) => (
            <button
              key={concepto.id}
              onClick={() => handleSelectConcepto(concepto)}
              disabled={loadingDetalle}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                conceptoSeleccionado?.concepto.clave === concepto.clave
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50'
              } ${loadingDetalle ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="text-xs font-mono text-gray-500 mb-1">{concepto.clave}</div>
              <h3 className="font-medium text-gray-900 text-sm mb-2">{concepto.nombre}</h3>
              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="px-2 py-1 bg-gray-100 rounded">{concepto.unidad}</span>
                <span className="text-blue-600">{concepto.partida}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Botones de Navegación */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Atrás
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!conceptoSeleccionado}
          className={`inline-flex items-center px-6 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            conceptoSeleccionado
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Siguiente
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
