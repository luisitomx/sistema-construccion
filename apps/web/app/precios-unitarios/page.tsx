'use client';

import { useState } from 'react';
import {
  ConfiguracionProyecto,
  TipoCliente,
  ConceptoDetalle,
  AjustesPersonalizados,
  PrecioUnitarioCalculado,
} from '@/types/precios-unitarios';
import { preciosUnitariosAPI } from '@/lib/api/precios-unitarios';
import ConfiguracionStep from '@/components/precios-unitarios/ConfiguracionStep';
import SeleccionConceptoStep from '@/components/precios-unitarios/SeleccionConceptoStep';
import PersonalizacionStep from '@/components/precios-unitarios/PersonalizacionStep';
import ResultadoStep from '@/components/precios-unitarios/ResultadoStep';

type Step = 1 | 2 | 3 | 4;

export default function PreciosUnitariosPage() {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estado del wizard
  const [configuracion, setConfiguracion] = useState<ConfiguracionProyecto>({
    tipoCliente: TipoCliente.PRIVADO,
    indirectosCampo: 5,
    indirectosOficina: 8,
    financiamiento: 3,
    utilidad: 12,
    cargosAdicionales: 0,
  });

  const [conceptoSeleccionado, setConceptoSeleccionado] = useState<ConceptoDetalle | null>(null);
  const [ajustesPersonalizados, setAjustesPersonalizados] = useState<AjustesPersonalizados>({});
  const [resultado, setResultado] = useState<PrecioUnitarioCalculado | null>(null);

  const handleCalcular = async () => {
    if (!conceptoSeleccionado) {
      setError('No hay concepto seleccionado');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await preciosUnitariosAPI.calcularPrecioUnitario({
        conceptoClave: conceptoSeleccionado.concepto.clave,
        configuracion,
        ajustesPersonalizados,
      });

      setResultado(data);
      setCurrentStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al calcular el precio unitario');
      console.error('Error al calcular PU:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNuevoCalculo = () => {
    setCurrentStep(1);
    setConceptoSeleccionado(null);
    setAjustesPersonalizados({});
    setResultado(null);
    setError(null);
  };

  const steps = [
    { number: 1, name: 'Configuración', description: 'Factores de sobrecosto' },
    { number: 2, name: 'Concepto', description: 'Seleccionar concepto' },
    { number: 3, name: 'Personalizar', description: 'Ajustar cantidades' },
    { number: 4, name: 'Resultado', description: 'Precio calculado' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Constructor de Precio Unitario</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sistema dinámico para calcular precios unitarios de construcción
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav aria-label="Progress">
            <ol className="flex items-center justify-between">
              {steps.map((step, idx) => (
                <li key={step.number} className={`relative ${idx !== steps.length - 1 ? 'pr-8 sm:pr-20 flex-1' : ''}`}>
                  {/* Connector Line */}
                  {idx !== steps.length - 1 && (
                    <div className="absolute top-4 left-0 -ml-px mt-0.5 h-0.5 w-full" aria-hidden="true">
                      <div className={`h-full ${step.number < currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    </div>
                  )}

                  {/* Step Circle */}
                  <div className="relative flex items-center group">
                    <span className="flex items-center">
                      <span
                        className={`relative z-10 w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                          step.number < currentStep
                            ? 'bg-blue-600 text-white'
                            : step.number === currentStep
                            ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                            : 'bg-white text-gray-400 border-2 border-gray-300'
                        }`}
                      >
                        {step.number < currentStep ? (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ) : (
                          step.number
                        )}
                      </span>
                    </span>
                    <span className="ml-3 min-w-0 flex flex-col">
                      <span
                        className={`text-xs font-semibold uppercase tracking-wide ${
                          step.number <= currentStep ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        {step.name}
                      </span>
                      <span className="text-xs text-gray-500">{step.description}</span>
                    </span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">{error}</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                <p className="mt-4 text-lg font-medium text-gray-900">Calculando precio unitario...</p>
                <p className="mt-2 text-sm text-gray-600">Por favor espera un momento</p>
              </div>
            </div>
          </div>
        )}

        {/* Steps Content */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {currentStep === 1 && (
            <ConfiguracionStep
              configuracion={configuracion}
              onChange={setConfiguracion}
              onNext={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 2 && (
            <SeleccionConceptoStep
              conceptoSeleccionado={conceptoSeleccionado}
              onSelect={setConceptoSeleccionado}
              onNext={() => setCurrentStep(3)}
              onBack={() => setCurrentStep(1)}
            />
          )}

          {currentStep === 3 && conceptoSeleccionado && (
            <PersonalizacionStep
              concepto={conceptoSeleccionado}
              ajustes={ajustesPersonalizados}
              onChange={setAjustesPersonalizados}
              onNext={handleCalcular}
              onBack={() => setCurrentStep(2)}
            />
          )}

          {currentStep === 4 && resultado && (
            <ResultadoStep
              resultado={resultado}
              onBack={() => setCurrentStep(3)}
              onNuevoCalculo={handleNuevoCalculo}
            />
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Los precios están basados en el catálogo actual de materiales y mano de obra.
            Los factores de rendimiento pueden variar según las condiciones del proyecto.
          </p>
        </div>
      </div>
    </div>
  );
}
