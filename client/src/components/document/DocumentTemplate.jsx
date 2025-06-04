import React from 'react';

// Tus componentes (deben estar bien definidos)
import { Company } from './Company';
import { Clients } from './Clients';
import { TableDocuments } from './TableDocuments';
import { Pagos } from './Pagos';
import { DocumentsInfo } from './DocumentsInfo';

// Función de formato de moneda
const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

export function DocumentTemplate() {
  return (
    <div className="p-4 md:p-6">
      {/* Contenedor principal del documento */}
      <div id="document-to-pdf" className="bg-white shadow-lg rounded-lg p-4 md:p-6 mx-auto w-full max-w-4xl">

        {/* Datos de la empresa - Factura */}
        <details className="mb-6 p-4 border border-gray-300 rounded bg-gray-50">
          <summary className="text-xl font-bold text-gray-800 mb-2">FACTURA</summary>
          <Company />
        </details>

        {/* Tabla cliente + info documento - Responsive */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <details className="p-4 border border-gray-300 rounded bg-gray-50">
            <summary className="font-semibold text-gray-700 mb-3">Datos del Cliente</summary>
            <Clients />
          </details>

          <details className="p-4 border border-gray-300 rounded bg-gray-50">
            <summary className="font-semibold text-gray-700 mb-3">Información del Documento</summary>
            <div className="space-y-2 text-sm">
              <DocumentsInfo />
            </div>
          </details>
        </div>

        {/* Tabla de productos - Responsive sin margen extra */}
        <div className="mb-6 border-collapse">          
          <TableDocuments formatCurrency={formatCurrency} />
        </div>

        {/* Forma de pago */}
        <div className="mt-6 p-4 border border-gray-300 rounded bg-gray-50">
          <h3 className="font-semibold text-gray-700 mb-2">Forma de Pago</h3>
          <Pagos />
        </div>
      </div>
    </div>
  );
}