'use client';

import { useState } from 'react';
import { ConfiguracionProyecto, TipoCliente } from '@/types/precios-unitarios';

interface ConfiguracionStepProps {
  configuracion: ConfiguracionProyecto;
  onChange: (config: ConfiguracionProyecto) => void;
  onNext: () => void;
}

export default function ConfiguracionStep({
  configuracion,
  onChange,
  onNext,
}: ConfiguracionStepProps) {
  const [config, setConfig] = useState<ConfiguracionProyecto>(configuracion);

  const handleChange = (field: keyof ConfiguracionProyecto, value: any) => {
    const newConfig = { ...config, [field]: value };
    setConfig(newConfig);
    onChange(newConfig);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext();
  };

  // Presets comunes
  const presets = {
    privadoEstandar: {
      tipoCliente: TipoCliente.PRIVADO,
      indirectosCampo: 5,
      indirectosOficina: 8,
      financiamiento: 3,
      utilidad: 12,
      cargosAdicionales: 0,
    },
    gobiernoFederal: {
      tipoCliente: TipoCliente.GOBIERNO,
      indirectosCampo: 6,
      indirectosOficina: 10,
      financiamiento: 2.5,
      utilidad: 8,
      cargosAdicionales: 0,
    },
    altaCompetencia: {
      tipoCliente: TipoCliente.PRIVADO,
      indirectosCampo: 4,
      indirectosOficina: 6,
      financiamiento: 2,
      utilidad: 8,
      cargosAdicionales: 0,
    },
  };

  const applyPreset = (presetName: keyof typeof presets) => {
    const preset = presets[presetName];
    setConfig(preset);
    onChange(preset);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración del Proyecto</h2>
        <p className="mt-2 text-sm text-gray-600">
          Define los factores de sobrecosto para tu proyecto
        </p>
      </div>

      {/* Presets */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-sm font-medium text-blue-900 mb-3">
          Configuraciones Predeterminadas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => applyPreset('privadoEstandar')}
            className="px-4 py-2 text-sm bg-white border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
          >
            Privado Estándar
          </button>
          <button
            type="button"
            onClick={() => applyPreset('gobiernoFederal')}
            className="px-4 py-2 text-sm bg-white border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
          >
            Gobierno Federal
          </button>
          <button
            type="button"
            onClick={() => applyPreset('altaCompetencia')}
            className="px-4 py-2 text-sm bg-white border border-blue-300 rounded-md hover:bg-blue-100 transition-colors"
          >
            Alta Competencia
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Tipo de Cliente */}
        <div>
          <label htmlFor="tipoCliente" className="block text-sm font-medium text-gray-700">
            Tipo de Cliente
          </label>
          <select
            id="tipoCliente"
            value={config.tipoCliente}
            onChange={(e) => handleChange('tipoCliente', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value={TipoCliente.PRIVADO}>Privado</option>
            <option value={TipoCliente.GOBIERNO}>Gobierno</option>
          </select>
        </div>

        {/* Indirectos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="indirectosCampo" className="block text-sm font-medium text-gray-700">
              Indirectos de Campo (%)
            </label>
            <input
              type="number"
              id="indirectosCampo"
              min="0"
              max="100"
              step="0.5"
              value={config.indirectosCampo}
              onChange={(e) => handleChange('indirectosCampo', parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Típico: 4-6% (supervisión, oficina de obra, almacén)
            </p>
          </div>

          <div>
            <label htmlFor="indirectosOficina" className="block text-sm font-medium text-gray-700">
              Indirectos de Oficina (%)
            </label>
            <input
              type="number"
              id="indirectosOficina"
              min="0"
              max="100"
              step="0.5"
              value={config.indirectosOficina}
              onChange={(e) => handleChange('indirectosOficina', parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Típico: 6-10% (administración, contabilidad, legal)
            </p>
          </div>
        </div>

        {/* Financiamiento y Utilidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="financiamiento" className="block text-sm font-medium text-gray-700">
              Financiamiento (%)
            </label>
            <input
              type="number"
              id="financiamiento"
              min="0"
              max="100"
              step="0.5"
              value={config.financiamiento}
              onChange={(e) => handleChange('financiamiento', parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Típico: 2-4% (costo de capital, créditos)
            </p>
          </div>

          <div>
            <label htmlFor="utilidad" className="block text-sm font-medium text-gray-700">
              Utilidad (%)
            </label>
            <input
              type="number"
              id="utilidad"
              min="0"
              max="100"
              step="0.5"
              value={config.utilidad}
              onChange={(e) => handleChange('utilidad', parseFloat(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Típico: 8-15% (ganancia esperada)
            </p>
          </div>
        </div>

        {/* Cargos Adicionales (Opcional) */}
        <div>
          <label htmlFor="cargosAdicionales" className="block text-sm font-medium text-gray-700">
            Cargos Adicionales (%) <span className="text-gray-400">(Opcional)</span>
          </label>
          <input
            type="number"
            id="cargosAdicionales"
            min="0"
            max="100"
            step="0.5"
            value={config.cargosAdicionales || 0}
            onChange={(e) => handleChange('cargosAdicionales', parseFloat(e.target.value) || 0)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
          <p className="mt-1 text-xs text-gray-500">
            Seguros, fianzas, impuestos especiales
          </p>
        </div>

        {/* Resumen de Factores */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="text-sm font-medium text-gray-900 mb-2">Resumen de Factores</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-gray-600">Indirectos Totales:</div>
            <div className="font-medium text-gray-900">
              {config.indirectosCampo + config.indirectosOficina}%
            </div>
            <div className="text-gray-600">Financ. + Util. + Cargos:</div>
            <div className="font-medium text-gray-900">
              {config.financiamiento + config.utilidad + (config.cargosAdicionales || 0)}%
            </div>
            <div className="text-gray-600 font-medium">Factor Total Aproximado:</div>
            <div className="font-bold text-blue-600">
              ~{(1 + (config.indirectosCampo + config.indirectosOficina + config.financiamiento + config.utilidad + (config.cargosAdicionales || 0)) / 100).toFixed(3)}x
            </div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Siguiente →
          </button>
        </div>
      </form>
    </div>
  );
}
