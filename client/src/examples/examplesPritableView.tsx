import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import { DocumentTemplatePdf } from '../-pdf/DocumentTemplatePdf';
import useCompany from '../hooks/company/useCompany';
import useClients from '../hooks/clients/useClients';

export const PrintableView = () => {
  const { empresas } = useCompany();

  // Validación segura: si no hay datos, no muestra nada
  if (!empresas) return null;

  const company = empresas[0];

  const { clients } = useClients();

  // Validación segura: si no hay datos, no renderiza nada
  if (!clients) return null;

  const client = clients[0];

  // console.log('Empresa:', company);
  // console.log('Cliente:', client);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generar PDF Presupuesto</h1>

      {/* Vista previa del PDF */}
      <div className="border rounded shadow-sm p-4 bg-gray-50 mb-6">
        <PDFViewer style={{ width: '100%', height: '500px' }}>
          <DocumentTemplatePdf company={company} client={client} />
        </PDFViewer>
      </div>

      {/* Botón para descargar
      <div className="text-right">
        <PDFDownloadLink
          document={<SimplePDF />}
          fileName="mi-primer-pdf.pdf"
          onClick={(event) => {
            console.log('Botón de descarga clickeado');
          }}
          onLoadingStart={() => {
            console.log('Iniciando generación del PDF...');
          }}
        >
          {({ loading }) =>
            loading ? 'Generando PDF...' : '📥 Descargar mi primer PDF'
          }
        </PDFDownloadLink>
      </div> */}
    </div>
  );
};
