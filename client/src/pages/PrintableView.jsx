// src/components/print/PrintableView.jsx

import { DocumentTemplate } from '../components/document/DocumentTemplate';

export const PrintableView = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Botón de imprimir */}
      <div className="mb-6 text-right">
        <button
          onClick={() => window.print()}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded no-print"
        >
          🖨️ Imprimir / Guardar como PDF
        </button>
      </div>

      {/* Aquí va tu factura */}
      <div className="printable-content">
        <DocumentTemplate />
      </div>
    </div>
  );
};
