import React, { useState } from 'react';
import { Database, Cloud, Smartphone, Monitor, FileCode, Calculator, Calendar, Users, BarChart3, Settings, Layers, GitBranch } from 'lucide-react';

export default function ArquitecturaConstruccion() {
  const [selectedModule, setSelectedModule] = useState(null);

  const modules = {
    programa: {
      title: "Módulo Programa Arquitectónico",
      icon: FileCode,
      color: "bg-blue-500",
      description: "El 'Objeto Génesis' - Núcleo del Sistema",
      features: [
        "Wizard de creación guiado",
        "Templates por tipología",
        "Validación automática",
        "Control de versiones",
        "AI Assistant para sugerencias"
      ]
    },
    diseno: {
      title: "Módulo Diseño CAD/BIM",
      icon: Layers,
      color: "bg-purple-500",
      description: "Integración con DWG y modelos BIM",
      features: [
        "ODA SDK para extracción de datos",
        "Autodesk APS para visualización",
        "Vinculación espacios ↔ DWG",
        "Auto-detección con ML",
        "Sincronización bidireccional"
      ]
    },
    costos: {
      title: "Motor de Costos",
      icon: Calculator,
      color: "bg-green-500",
      description: "Explosión de Insumos y Presupuestos",
      features: [
        "Base de Precios Unitarios (BDPU)",
        "Base de Análisis Unitarios (BDAU)",
        "Cálculo incremental optimizado",
        "Precios temporales",
        "Integración con proveedores"
      ]
    },
    programacion: {
      title: "Programación y Recursos",
      icon: Calendar,
      color: "bg-orange-500",
      description: "Gantt Avanzado y Gestión de Recursos",
      features: [
        "DHTMLX Gantt Pro",
        "Camino crítico automático",
        "Nivelación de recursos",
        "What-if scenarios",
        "Alertas proactivas"
      ]
    },
    ejecucion: {
      title: "Ejecución y Campo",
      icon: Smartphone,
      color: "bg-red-500",
      description: "App Móvil Offline-First",
      features: [
        "Modo offline completo",
        "Reportes diarios digitales",
        "Escaneo QR y GPS",
        "Integración IoT/drones",
        "Firmas digitales"
      ]
    },
    nominas: {
      title: "Nóminas",
      icon: Users,
      color: "bg-pink-500",
      description: "Gestión de Nómina de Construcción",
      features: [
        "Múltiples clasificaciones",
        "Cálculo de horas extras",
        "Certified payroll",
        "Impacto en tiempo real",
        "Integración con recursos"
      ]
    },
    bi: {
      title: "Inteligencia de Negocio",
      icon: BarChart3,
      color: "bg-indigo-500",
      description: "Dashboards y Reportes WYSIWYG",
      features: [
        "Diseñador de reportes embebido",
        "Power BI / Tableau",
        "ML: predicción de costos",
        "Analytics en tiempo real",
        "Data Lake histórico"
      ]
    }
  };

  const layers = [
    {
      name: "Presentación",
      items: ["Web App (React/Next)", "Mobile App (React Native)", "Desktop (Electron)", "API Gateway (GraphQL)"],
      color: "bg-gradient-to-r from-blue-400 to-blue-600"
    },
    {
      name: "Servicios",
      items: ["Auth Service", "Notification Service", "File Storage", "ML/Analytics"],
      color: "bg-gradient-to-r from-green-400 to-green-600"
    },
    {
      name: "Microservicios Core",
      items: ["Programa Service", "Design Service", "Cost Engine", "Schedule Service", "Execution Service", "Payroll Service"],
      color: "bg-gradient-to-r from-purple-400 to-purple-600"
    },
    {
      name: "Datos",
      items: ["PostgreSQL (Core)", "MongoDB (Docs)", "Redis (Cache)", "ElasticSearch"],
      color: "bg-gradient-to-r from-orange-400 to-orange-600"
    }
  ];

  const ModuleCard = ({ moduleKey, module }) => {
    const Icon = module.icon;
    const isSelected = selectedModule === moduleKey;
    
    return (
      <div
        onClick={() => setSelectedModule(isSelected ? null : moduleKey)}
        className={`${module.color} p-4 rounded-lg cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
          isSelected ? 'ring-4 ring-yellow-400 scale-105' : ''
        }`}
      >
        <div className="flex items-center gap-3 mb-2">
          <Icon className="w-6 h-6 text-white" />
          <h3 className="text-white font-bold text-sm">{module.title}</h3>
        </div>
        <p className="text-white text-xs opacity-90">{module.description}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            Sistema Integral de Gestión de Construcción
          </h1>
          <p className="text-gray-300 text-lg mb-2">
            Basado en el Programa Arquitectónico como "Objeto Génesis"
          </p>
          <div className="flex items-center justify-center gap-2 text-yellow-400">
            <GitBranch className="w-5 h-5" />
            <span className="text-sm font-semibold">Arquitectura Unificada - Versión 2.0</span>
          </div>
        </div>

        {/* Arquitectura en Capas */}
        <div className="mb-12 bg-gray-800 p-6 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Settings className="w-6 h-6" />
            Arquitectura en Capas
          </h2>
          <div className="space-y-4">
            {layers.map((layer, idx) => (
              <div key={idx} className="relative">
                <div className={`${layer.color} p-4 rounded-lg shadow-lg`}>
                  <h3 className="text-white font-bold mb-3">{layer.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {layer.items.map((item, i) => (
                      <div key={i} className="bg-white bg-opacity-20 px-3 py-2 rounded text-white text-xs font-medium backdrop-blur-sm">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
                {idx < layers.length - 1 && (
                  <div className="flex justify-center my-2">
                    <div className="w-0.5 h-4 bg-gray-600"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Módulos Principales */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Layers className="w-6 h-6" />
            Módulos del Sistema (Haz clic para explorar)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(modules).map(([key, module]) => (
              <ModuleCard key={key} moduleKey={key} module={module} />
            ))}
          </div>
        </div>

        {/* Panel de Detalles */}
        {selectedModule && (
          <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border-2 border-yellow-400 animate-fadeIn">
            <div className="flex items-start gap-4 mb-6">
              {React.createElement(modules[selectedModule].icon, { className: "w-12 h-12 text-yellow-400" })}
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-white mb-2">
                  {modules[selectedModule].title}
                </h3>
                <p className="text-gray-300 text-lg">
                  {modules[selectedModule].description}
                </p>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-xl font-semibold text-yellow-400 mb-4">Características Principales:</h4>
              {modules[selectedModule].features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-gray-700 p-3 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-gray-900 font-bold text-sm">{idx + 1}</span>
                  </div>
                  <p className="text-gray-200">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Flujo de Datos Central */}
        <div className="mt-12 bg-gradient-to-r from-blue-900 to-purple-900 p-8 rounded-xl shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Database className="w-6 h-6" />
            Flujo del "Objeto Génesis" (Espacio_ID)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl font-bold text-yellow-400 mb-2">1</div>
              <h3 className="text-white font-bold mb-2">Programa Arquitectónico</h3>
              <p className="text-gray-300 text-sm">Define espacios con área requerida</p>
              <div className="mt-3 bg-blue-500 px-3 py-1 rounded text-white text-xs inline-block">Espacio_ID creado</div>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl font-bold text-yellow-400 mb-2">2</div>
              <h3 className="text-white font-bold mb-2">Vinculación DWG</h3>
              <p className="text-gray-300 text-sm">Liga polilíneas al Espacio_ID</p>
              <div className="mt-3 bg-purple-500 px-3 py-1 rounded text-white text-xs inline-block">Área real calculada</div>
            </div>
            
            <div className="bg-white bg-opacity-10 p-6 rounded-lg backdrop-blur-sm">
              <div className="text-4xl font-bold text-yellow-400 mb-2">3</div>
              <h3 className="text-white font-bold mb-2">Costos, Cronograma, Ejecución</h3>
              <p className="text-gray-300 text-sm">Toda la data vinculada al mismo ID</p>
              <div className="mt-3 bg-green-500 px-3 py-1 rounded text-white text-xs inline-block">Trazabilidad completa</div>
            </div>
          </div>
          
          <div className="mt-6 bg-yellow-400 bg-opacity-20 border-2 border-yellow-400 rounded-lg p-4">
            <p className="text-yellow-200 text-center font-semibold">
              ⚡ Ventaja Competitiva: Respuesta en tiempo real a "¿Cómo afecta este cambio de diseño mi costo y fecha final?"
            </p>
          </div>
        </div>

        {/* Stack Tecnológico */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-400" />
              Backend Stack
            </h3>
            <div className="space-y-2">
              {["Node.js + TypeScript + NestJS", "PostgreSQL + MongoDB + Redis", "Docker + Kubernetes", "RabbitMQ/Kafka", "Python (ML/Analytics)", "C++/.NET (ODA SDK)"].map((tech, i) => (
                <div key={i} className="bg-gray-700 px-4 py-2 rounded text-gray-200 text-sm">
                  {tech}
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-xl shadow-xl">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Monitor className="w-5 h-5 text-green-400" />
              Frontend Stack
            </h3>
            <div className="space-y-2">
              {["React 18 + Next.js 14", "TypeScript + TailwindCSS", "React Native + Expo", "Three.js (visualización 3D)", "Redux Toolkit/Zustand", "Electron (desktop opcional)"].map((tech, i) => (
                <div key={i} className="bg-gray-700 px-4 py-2 rounded text-gray-200 text-sm">
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-400 text-sm">
          <p>🏗️ Sistema diseñado para unificar diseño, costos y ejecución desde el día 0</p>
          <p className="mt-2">Pre-emptor de herramientas tradicionales • Propiedad del arquitecto/owner</p>
        </div>
      </div>
    </div>
  );
}