
// Llamando los componentes para dibujar el documento
import { DocumentsInfo } from './DocumentsInfo';
import { Company } from './Company';
import { Clients } from './Clients';
import { TableDocuments } from './TableDocuments';
import { Pagos } from './Pagos';

export function Document() {

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Datos del cliente (empresa) */}
            <div className="w-[40.5376%] p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
                <Company />
            </div>

            <p>&nbsp;</p>
            <p>FACTURA</p>
            <p>&nbsp;</p>

            {/* Tabla principal */}
            <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
                <tbody>
                    <tr>
                        {/* Carga los datos del documento */}
                        <td className="w-[40.5376%] p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
                            <DocumentsInfo />
                        </td>

                        {/* Tabla de cliente */}
                        <td style={{ width: '7.79569%' }}>&nbsp;</td>
                        <td style={{ width: '51.6667%' }} className="p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm">
                            <Clients />
                        </td> {/*termina tabla del cliente*/}
                    </tr>
                </tbody>
            </table>

            <p>&nbsp;</p>

            {/* Tabla de detalles de productos */}
            <TableDocuments />

            <p>&nbsp;</p>
            {/* Tabla de forma de pago */}
            <Pagos />

        </div>
    );
}