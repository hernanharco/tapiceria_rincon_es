import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { DocumentTemplatePdf } from '../modules/pdf/DocumentTemplatePdf';
import useCompany from '../modules/company/hooks/useCompany';
import useClients from '../modules/clients/hooks/useClients';
import useDocument from '../modules/documents/hooks/useDocuments';

export const PrintableView = () => {
  const { empresas } = useCompany();
  const { clients } = useClients();
  const { documents } = useDocument();

  const company = empresas?.[0];
  const client = clients?.[0];
  const document = documents?.[0];

  // Muestra en consola si hay datos
  console.log('Datos de empresa:', company);
  console.log('Datos de cliente:', client);
  console.log('Datos de documento:', document);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generar PDF Presupuesto</h1>

      <div className="border rounded shadow-sm p-4 bg-gray-50 mb-6">
        <PDFViewer style={{ width: '100%', height: '600px' }}>
          <DocumentTemplatePdf 
            company={company} 
            client={client} 
            document={document}
          />
        </PDFViewer>
      </div>
    </div>
  );
};