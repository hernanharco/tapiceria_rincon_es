
import useFooters from '../hooks/useFooters';
import useDataDocuments from '../hooks/useDataDocuments';

export default function DocumentsFooter() {
  const { footers, loadFooterPorId, refetchclientes } = useFooters();
  const { datadocuments } = useDataDocuments();

  // Si no hay datos, mostramos mensaje
  if (!footers || footers.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay totales disponibles
      </div>
    );
  }

  // Usamos el primer footer (puedes adaptarlo si hay múltiples)
  const footer = footers[0];

  return (
    <div className="border-t border-gray-300 pt-4">    

      {/* En escritorio */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg bg-gray-50">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold">
              <th className="text-center border-r border-gray-300">Subtotal</th>
              <th className="text-center border-r border-gray-300">Base Imponible</th>
              <th className="text-center border-r border-gray-300">IVA</th>
              <th className="text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100 transition-colors">
              <td className="text-center border border-gray-300">{footer.subtotal}</td>
              <td className="text-center border border-gray-300">{footer.base_imponible}</td>
              <td className="text-center border border-gray-300">{footer.iva}%</td>
              <td className="text-center border border-gray-300 font-bold">{footer.total}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* En móvil - Diseño vertical */}
      <div className="md:hidden space-y-3">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Subtotal:</span>
          <span className="font-semibold">{footer.subtotal}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Base Imponible:</span>
          <span className="font-semibold">{footer.base_imponible}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">IVA ({footer.iva}%):</span>
          <span className="font-semibold">{footer.iva}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>{footer.total}</span>
        </div>
      </div>
    </div>
  );
}