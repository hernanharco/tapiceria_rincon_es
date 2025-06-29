import { useEffect } from "react";
import { formatCurrency } from "../../../utils/formatUtils";

export const DocumentsFooter = ({ filteredProducts = [], setDatFooter }) => {
  // Calcular totales
  // console.log("filteredProducts DocumentsFooter: ", filteredProducts)
  const subtotal = filteredProducts.reduce(
    (sum, item) =>
      sum + (parseFloat(item.precio) || 0) * (parseInt(item.cantidad) || 1),
    0
  );

  const totalDescuento = filteredProducts.reduce((sum, item) => {
    const price = parseFloat(item.precio) || 0;
    const quantity = parseInt(item.cantidad) || 1;
    const dto = parseFloat(item.dto) || 0;

    return sum + price * quantity * (dto / 100);
  }, 0);

  const baseImponible = subtotal - totalDescuento;
  const iva = 21; // Puedes hacerlo dinámico si lo necesitas
  const total = baseImponible * (1 + iva / 100);

  // Enviar datos al padre
  useEffect(() => {
    if (typeof setDatFooter === "function") {
      setDatFooter({
        datsubTotal: formatCurrency(subtotal),
        datbaseImponible: formatCurrency(baseImponible),
        datIva: `${iva}%`,
        datTotal: formatCurrency(total),
      });
    }
  }, [baseImponible, iva, total]);

  return (
    <div className="border-t border-gray-300 pt-4">
      {/* Tabla escritorio */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg bg-gray-50">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold">
              <th className="text-center border-r border-gray-300 py-2 px-4">
                Subtotal
              </th>
              <th className="text-center border-r border-gray-300 py-2 px-4">
                Base Imponible
              </th>
              <th className="text-center border-r border-gray-300 py-2 px-4">
                IVA
              </th>
              <th className="text-center py-2 px-4">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-gray-100 transition-colors">
              <td className="text-center border border-gray-300 py-2 px-4">
                {formatCurrency(subtotal)}
              </td>
              <td className="text-center border border-gray-300 py-2 px-4">
                {formatCurrency(baseImponible)}
              </td>
              <td className="text-center border border-gray-300 py-2 px-4">
                {iva}%
              </td>
              <td className="text-center border border-gray-300 py-2 px-4 font-bold">
                {formatCurrency(total)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Versión móvil */}
      <div className="md:hidden space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-300 mt-4">
        <h4 className="font-semibold text-gray-700">Totales:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="text-gray-600">Subtotal:</div>
          <div className="text-right font-medium">
            {formatCurrency(subtotal)}
          </div>

          <div className="text-gray-600">Descuento:</div>
          <div className="text-right text-red-500">
            -{formatCurrency(totalDescuento)}
          </div>

          <div className="text-gray-600">Base Imponible:</div>
          <div className="text-right">{formatCurrency(baseImponible)}</div>

          <div className="text-gray-600">IVA ({iva}%):</div>
          <div className="text-right">
            {formatCurrency(baseImponible * (iva / 100))}
          </div>

          <div className="font-bold text-gray-800">Total:</div>
          <div className="font-bold text-right">{formatCurrency(total)}</div>
        </div>
      </div>
    </div>
  );
};
