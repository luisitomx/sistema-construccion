'use client';

import { PrecioUnitarioCalculado } from '@/types/precios-unitarios';
import { ChevronLeft, Download, Printer, Check } from 'lucide-react';

interface ResultadoStepProps {
  resultado: PrecioUnitarioCalculado;
  onBack: () => void;
  onNuevoCalculo: () => void;
}

export default function ResultadoStep({
  resultado,
  onBack,
  onNuevoCalculo,
}: ResultadoStepProps) {
  const { concepto, costos, desglose } = resultado;

  const formatMoney = (value: string | number) => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(num);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Crear JSON descargable
    const dataStr = JSON.stringify(resultado, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `PU_${concepto.clave}_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6 text-white" />
            </div>
          </div>
          <div className="ml-4 flex-1">
            <h2 className="text-2xl font-bold text-green-900">¡Precio Unitario Calculado!</h2>
            <p className="mt-1 text-sm text-green-700">
              El cálculo se ha completado exitosamente
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
              title="Imprimir"
            >
              <Printer className="h-5 w-5" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition-colors"
              title="Descargar JSON"
            >
              <Download className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Concepto Info */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Concepto</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-sm text-gray-500">Clave</div>
            <div className="text-lg font-mono font-medium text-gray-900">{concepto.clave}</div>
          </div>
          <div className="md:col-span-2">
            <div className="text-sm text-gray-500">Nombre</div>
            <div className="text-lg font-medium text-gray-900">{concepto.nombre}</div>
          </div>
        </div>
      </div>

      {/* Precio Total Destacado */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-8 text-white">
        <div className="text-center">
          <div className="text-sm font-medium uppercase tracking-wider mb-2">Precio Unitario Total</div>
          <div className="text-5xl font-bold">{formatMoney(costos.precioUnitarioTotal)}</div>
          <div className="text-lg mt-2 opacity-90">por {concepto.unidad}</div>
        </div>
      </div>

      {/* Desglose de Costos Directo */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Costo Directo</h3>

        <div className="space-y-4">
          {/* Materiales */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">1. Materiales</span>
              <span className="text-lg font-semibold text-gray-900">{formatMoney(costos.materiales)}</span>
            </div>
            {desglose.materiales.length > 0 && (
              <div className="ml-4 space-y-2">
                {desglose.materiales.map((material, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-600 py-1 border-b border-gray-100">
                    <div className="flex-1">
                      <span className="font-mono text-xs text-gray-400 mr-2">{material.clave}</span>
                      <span>{material.nombre}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">
                        {material.cantidad} {material.unidad} × ${material.precioUnitario.toFixed(2)} × {material.factorMerma}
                      </span>
                      <span className="font-medium text-gray-900 w-24 text-right">
                        {formatMoney(material.importe)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Mano de Obra */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">2. Mano de Obra</span>
              <span className="text-lg font-semibold text-gray-900">{formatMoney(costos.manoObra)}</span>
            </div>
            {desglose.manoObra.length > 0 && (
              <div className="ml-4 space-y-2">
                {desglose.manoObra.map((mo, idx) => (
                  <div key={idx} className="flex justify-between text-sm text-gray-600 py-1 border-b border-gray-100">
                    <div className="flex-1">
                      <span>{mo.especialidad}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-gray-500">
                        {mo.cantidad} × {mo.jornadas.toFixed(4)} jornadas × ${mo.salarioBase} × {mo.factorSalarioReal}
                      </span>
                      <span className="font-medium text-gray-900 w-24 text-right">
                        {formatMoney(mo.importe)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Herramienta */}
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-gray-700">3. Herramienta ({desglose.herramienta.porcentaje}% sobre MO)</span>
            <span className="text-lg font-semibold text-gray-900">{formatMoney(costos.herramienta)}</span>
          </div>

          {/* Total Costo Directo */}
          <div className="flex justify-between items-center pt-4 border-t-2 border-gray-300">
            <span className="text-base font-bold text-gray-900">COSTO DIRECTO</span>
            <span className="text-xl font-bold text-blue-600">{formatMoney(costos.costoDirecto)}</span>
          </div>
        </div>
      </div>

      {/* Indirectos y Cargos */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Indirectos y Cargos</h3>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">
              Indirectos ({desglose.resumen.indirectos.porcentaje}%)
            </span>
            <span className="font-semibold text-gray-900">{formatMoney(costos.indirectos)}</span>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-sm font-medium text-gray-900">Subtotal (CD + Indirectos)</span>
            <span className="text-lg font-semibold text-gray-900">{formatMoney(costos.subtotal)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">
              Financiamiento ({desglose.configuracion.financiamiento}%)
            </span>
            <span className="font-semibold text-gray-900">{formatMoney(costos.financiamiento)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-700">
              Utilidad ({desglose.configuracion.utilidad}%)
            </span>
            <span className="font-semibold text-gray-900">{formatMoney(costos.utilidad)}</span>
          </div>

          {parseFloat(costos.cargosAdicionales) > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">
                Cargos Adicionales ({desglose.configuracion.cargosAdicionales || 0}%)
              </span>
              <span className="font-semibold text-gray-900">{formatMoney(costos.cargosAdicionales)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Configuración Aplicada */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Configuración Aplicada</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div>
            <span className="text-gray-500">Tipo Cliente:</span>
            <div className="font-medium text-gray-900 capitalize">{desglose.configuracion.tipoCliente}</div>
          </div>
          <div>
            <span className="text-gray-500">Indirectos Campo:</span>
            <div className="font-medium text-gray-900">{desglose.configuracion.indirectosCampo}%</div>
          </div>
          <div>
            <span className="text-gray-500">Indirectos Oficina:</span>
            <div className="font-medium text-gray-900">{desglose.configuracion.indirectosOficina}%</div>
          </div>
          <div>
            <span className="text-gray-500">Financiamiento:</span>
            <div className="font-medium text-gray-900">{desglose.configuracion.financiamiento}%</div>
          </div>
          <div>
            <span className="text-gray-500">Utilidad:</span>
            <div className="font-medium text-gray-900">{desglose.configuracion.utilidad}%</div>
          </div>
          <div>
            <span className="text-gray-500">Fecha Cálculo:</span>
            <div className="font-medium text-gray-900">
              {new Date(desglose.fechaCalculo).toLocaleDateString('es-MX')}
            </div>
          </div>
        </div>
      </div>

      {/* Botones de Acción */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Modificar
        </button>
        <button
          type="button"
          onClick={onNuevoCalculo}
          className="px-6 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Nuevo Cálculo
        </button>
      </div>
    </div>
  );
}
