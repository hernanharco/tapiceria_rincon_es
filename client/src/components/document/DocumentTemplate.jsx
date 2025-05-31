// Document.jsx
import useDocuments from '../../hooks/useDocuments';

// Tus componentes
import { DocumentsInfo } from './DocumentsInfo';
import { Company } from './Company';
import { Clients } from './Clients';
import { TableDocuments } from './TableDocuments';
import { Pagos } from './Pagos';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

export function DocumentTemplate() { 

  const { documentos } = useDocuments();

  return (
    <div>
      {/* Contenido del documento */}
      <div id="document-to-pdf" className="max-w-4xl mx-auto p-6 bg-white">
        {/* Datos del cliente (empresa) */}
        <div className="w-[40.5376%] p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
          <Company />
        </div>

        <p>&nbsp;</p>
        <p>FACTURA</p>
        <p>&nbsp;</p>

        {/* Informacion del Documento */}
        <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
          <tbody>
            <tr>
              <td className="w-[40.5376%] p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
                <DocumentsInfo documentos={documentos}/>
              </td>
              <td style={{ width: '7.79569%' }}>&nbsp;</td>
              <td style={{ width: '51.6667%' }} className="p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
                <Clients />
              </td>
            </tr>
          </tbody>
        </table>

        <p>&nbsp;</p>

        {/* Tabla de productos y totales */}
        <TableDocuments documentos={documentos}/>

        <p>&nbsp;</p>

        {/* Forma de pago */}
        <Pagos />
      </div>
    </div>
  );
}