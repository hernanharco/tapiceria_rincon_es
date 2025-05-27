// src/components/documents/TableDocuments.jsx
import useDataDocuments from '../../hooks/useDataDocuments';
import useFooters from '../../hooks/useFooters';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

export const TableDocuments = () => {
  const { datadocuments } = useDataDocuments();
  const { footers } = useFooters();

  const footer = footers && footers.length > 0 ? footers[0] : null;

  // Validación segura para evitar errores
  const hasItems = Array.isArray(datadocuments) && datadocuments.length > 0;
  const hasFooter = footer !== null;

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-sm p-4">
      {/* Tabla de productos */}
      {hasItems && (
        <table className="min-w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-200 text-gray-700 font-semibold">
              {/* Agregamos borde izquierdo a la primera columna */}
              <th className="px-4 py-2 text-sm text-center border border-gray-300">Referencia</th>
              <th className="px-4 py-2 text-sm text-center border-t border-b border-r border-gray-300">Descripción</th>
              <th className="px-4 py-2 text-sm text-center border-t border-b border-r border-gray-300 hidden md:table-cell">Cantidad</th>
              <th className="px-4 py-2 text-sm text-center border-t border-b border-r border-gray-300 hidden md:table-cell">Precio</th>
              <th className="px-4 py-2 text-sm text-center border-t border-b border-r border-gray-300 hidden md:table-cell">Dto.</th>
              <th className="px-4 py-2 text-sm text-center border border-gray-300">Importe</th>
            </tr>
          </thead>
          <tbody>
            {datadocuments.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                {/* Añadimos borde izquierdo en la primera celda */}
                <td className="px-4 py-2 text-sm text-gray-800 text-center border border-gray-300">
                  {item.referencia || '-'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-center border-t border-b border-r border-gray-300">
                  {item.descripcion || '-'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-center border-t border-b border-r border-gray-300 hidden md:table-cell">
                  {item.cantidad || 0}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-center border-t border-b border-r border-gray-300 hidden md:table-cell">
                  {item.precio ? formatCurrency(item.precio) : '€0.00'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-center border-t border-b border-r border-gray-300 hidden md:table-cell">
                  {item.dto ? `${item.dto}%` : '0%'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-center border border-gray-300">
                  {item.importe ? formatCurrency(item.importe) : '€0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Espacio entre tablas */}
      {hasItems && hasFooter && <div className="mb-6"></div>}

      {/* Tabla de totales */}
      {hasFooter && (
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold">
              <th className="px-4 py-2 text-sm text-center border border-gray-300">Subtotal</th>
              <th className="px-4 py-2 text-sm text-center border-t border-b border-r border-gray-300">Base Imponible</th>
              <th className="px-4 py-2 text-sm text-center border-t border-b border-r border-gray-300">IVA 21%</th>
              <th className="px-4 py-2 text-sm text-center border border-gray-300">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 text-sm text-center border border-gray-300">
                {footer.subtotal ? formatCurrency(footer.subtotal) : '€0.00'}
              </td>
              <td className="px-4 py-2 text-sm text-center border-t border-b border-r border-gray-300">
                {footer.base_imponible ? formatCurrency(footer.base_imponible) : '€0.00'}
              </td>
              <td className="px-4 py-2 text-sm text-center border-t border-b border-r border-gray-300">
                {footer.iva ? `${footer.iva}%` : '0%'}
              </td>
              <td className="px-4 py-2 text-sm text-center font-bold border border-gray-300 text-gray-900">
                {footer.total ? formatCurrency(footer.total) : '€0.00'}
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};