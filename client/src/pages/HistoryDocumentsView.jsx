
import { HistoryTemplate } from '../modules/history/HistoryTemplate.jsx';

export const HistoryDocumentsView = () => {
  
  return (
    <div className="p-6">

      <h2 className="text-2xl font-bold text-gray-800 mb-4">Cliente</h2>

      {/* Dibujamos la tabla de Historial de documentos*/}      
      <HistoryTemplate />
    </div>
  );
};