import { HistoryTemplate } from '../features/history/components/HistoryTemplate.jsx';

export const HistoryDocumentsView = () => {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Encabezado de página - con padding extra a la izq en mobile por hamburguesa */}
      <div className="border-b border-gray-200 bg-white">
        <div className="px-4 md:px-8 py-4 md:py-6 pl-14 md:pl-8">
          <div className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                Historial <span className="text-blue-600">.</span>
              </h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Documentos, presupuestos, albaranes y facturas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido - SIN padding izquierdo extra (la hamburguesa solo afecta al header) */}
      <div className="px-2 md:px-8 py-2 md:py-6">
        <HistoryTemplate />
      </div>
    </div>
  );
};
