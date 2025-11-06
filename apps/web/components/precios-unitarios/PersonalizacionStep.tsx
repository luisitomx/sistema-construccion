'use client';

import { useState } from 'react';
import { ConceptoDetalle, AjustesPersonalizados } from '@/types/precios-unitarios';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

interface PersonalizacionStepProps {
  concepto: ConceptoDetalle;
  ajustes: AjustesPersonalizados;
  onChange: (ajustes: AjustesPersonalizados) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function PersonalizacionStep({
  concepto,
  ajustes,
  onChange,
  onNext,
  onBack,
}: PersonalizacionStepProps) {
  const [materialesAjustados, setMaterialesAjustados] = useState<{ [clave: string]: number }>(
    ajustes.materiales || {}
  );
  const [rendimientoAjustado, setRendimientoAjustado] = useState<number | undefined>(
    ajustes.rendimiento
  );
  const [mostrarInfo, setMostrarInfo] = useState(false);

  const handleMaterialChange = (clave: string, valor: number) => {
    const nuevosAjustes = { ...materialesAjustados, [clave]: valor };
    setMaterialesAjustados(nuevosAjustes);
    onChange({
      materiales: nuevosAjustes,
      rendimiento: rendimientoAjustado,
    });
  };

  const handleRendimientoChange = (valor: number) => {
    setRendimientoAjustado(valor);
    onChange({
      materiales: materialesAjustados,
      rendimiento: valor,
    });
  };

  const resetMateriales = () => {
    setMaterialesAjustados({});
    onChange({
      materiales: {},
      rendimiento: rendimientoAjustado,
    });
  };

  const resetRendimiento = () => {
    setRendimientoAjustado(undefined);
    onChange({
      materiales: materialesAjustados,
      rendimiento: undefined,
    });
  };

  const resetAll = () => {
    setMaterialesAjustados({});
    setRendimientoAjustado(undefined);
    onChange({ materiales: {}, rendimiento: undefined });
  };

  const tieneAjustes = Object.keys(materialesAjustados).length > 0 || rendimientoAjustado !== undefined;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Personalizar Cantidades</h2>
        <p className="mt-2 text-sm text-gray-600">
          Ajusta las cantidades de materiales y el rendimiento si es necesario (opcional)
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <button
          type="button"
          onClick={() => setMostrarInfo(!mostrarInfo)}
          className="flex items-center w-full text-left"
        >
          <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
          <span className="text-sm font-medium text-blue-900">
            ¿Cuándo personalizar?
          </span>
          <ChevronRight className={`h-4 w-4 ml-auto text-blue-600 transition-transform ${mostrarInfo ? 'rotate-90' : ''}`} />
        </button>
        {mostrarInfo && (
          <div className="mt-3 text-sm text-blue-800 space-y-2 pl-7">
            <p>• <strong>Materiales:</strong> Ajusta si usarás cantidades diferentes a las estándar (por ejemplo, mayor espesor de aplanado)</p>
            <p>• <strong>Rendimiento:</strong> Modifica según condiciones especiales del proyecto (altura, acceso difícil, experiencia de la cuadrilla)</p>
            <p>• Si no realizas ajustes, se usarán los valores estándar del catálogo</p>
          </div>
        )}
      </div>

      {/* Concepto Seleccionado */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Concepto: {concepto.concepto.clave}</h3>
        <p className="text-sm text-gray-700">{concepto.concepto.nombre}</p>
      </div>

      {/* Ajuste de Materiales */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Materiales</h3>
          {Object.keys(materialesAjustados).length > 0 && (
            <button
              type="button"
              onClick={resetMateriales}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Restaurar valores originales
            </button>
          )}
        </div>

        <div className="space-y-3">
          {concepto.materiales.map((material) => {
            const valorAjustado = materialesAjustados[material.clave];
            const valorActual = valorAjustado !== undefined ? valorAjustado : material.cantidad;
            const esModificado = valorAjustado !== undefined;

            return (
              <div
                key={material.clave}
                className={`p-4 rounded-lg border-2 ${
                  esModificado ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-gray-500">{material.clave}</span>
                      {esModificado && (
                        <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded">
                          Modificado
                        </span>
                      )}
                    </div>
                    <h4 className="text-sm font-medium text-gray-900">{material.nombre}</h4>
                    <p className="text-xs text-gray-600 mt-1">
                      ${material.precioUnitario.toFixed(2)} / {material.unidad} × Factor merma: {material.factorMerma}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Cantidad Original
                    </label>
                    <div className="text-sm font-medium text-gray-900">
                      {material.cantidad} {material.unidad}
                    </div>
                  </div>
                  <div>
                    <label htmlFor={`material-${material.clave}`} className="block text-xs text-gray-600 mb-1">
                      Nueva Cantidad
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        id={`material-${material.clave}`}
                        min="0"
                        step="0.001"
                        value={valorActual}
                        onChange={(e) => handleMaterialChange(material.clave, parseFloat(e.target.value))}
                        className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-xs text-gray-500">{material.unidad}</span>
                    </div>
                  </div>
                </div>

                {esModificado && (
                  <div className="mt-2 text-xs text-yellow-700">
                    Cambio: {((valorActual - material.cantidad) / material.cantidad * 100).toFixed(1)}%
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Ajuste de Rendimiento */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Rendimiento de Cuadrilla</h3>
          {rendimientoAjustado !== undefined && (
            <button
              type="button"
              onClick={resetRendimiento}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Restaurar valor original
            </button>
          )}
        </div>

        <div className={`p-4 rounded-lg border-2 ${
          rendimientoAjustado !== undefined ? 'border-yellow-400 bg-yellow-50' : 'border-gray-200 bg-white'
        }`}>
          <div className="mb-3">
            <h4 className="text-sm font-medium text-gray-900">Cuadrilla: {JSON.stringify(concepto.rendimiento.cuadrilla)}</h4>
            <p className="text-xs text-gray-600 mt-1">
              {concepto.rendimiento.actividad} - Región: {concepto.rendimiento.region}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Rendimiento Original
              </label>
              <div className="text-sm font-medium text-gray-900">
                {concepto.rendimiento.rendimiento} {concepto.concepto.unidad}/día
              </div>
            </div>
            <div>
              <label htmlFor="rendimiento" className="block text-xs text-gray-600 mb-1">
                Nuevo Rendimiento
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  id="rendimiento"
                  min="0"
                  step="0.1"
                  value={rendimientoAjustado !== undefined ? rendimientoAjustado : concepto.rendimiento.rendimiento}
                  onChange={(e) => handleRendimientoChange(parseFloat(e.target.value))}
                  className="block w-full text-sm rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500 whitespace-nowrap">{concepto.concepto.unidad}/día</span>
              </div>
            </div>
          </div>

          {rendimientoAjustado !== undefined && (
            <div className="mt-2 text-xs text-yellow-700">
              Cambio: {((rendimientoAjustado - concepto.rendimiento.rendimiento) / concepto.rendimiento.rendimiento * 100).toFixed(1)}%
              {rendimientoAjustado < concepto.rendimiento.rendimiento ? ' (menor rendimiento = mayor costo)' : ' (mayor rendimiento = menor costo)'}
            </div>
          )}
        </div>
      </div>

      {/* Botón de Reset Total */}
      {tieneAjustes && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={resetAll}
            className="text-sm text-red-600 hover:text-red-800 underline"
          >
            Resetear todos los ajustes
          </button>
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
          className="inline-flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Calcular Precio Unitario
          <ChevronRight className="h-4 w-4 ml-1" />
        </button>
      </div>
    </div>
  );
}
