import useFooters from '../hooks/useFooters';
import { useEffect, useState } from 'react';

export const DocumentsFooter = ({ numDocument, filteredProducts }) => {
  const { footers, saveFooter, updateFooter, getFootersByFieldId } = useFooters();
  const [footer, setFooter] = useState(null);

  // Si no hay datos, mostramos mensaje
  if (!filteredProducts || filteredProducts.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No hay totales disponibles
      </div>
    );
  }

  // Función para calcular los totales desde filteredProducts
  const calcularTotales = () => {
    let subtotal = 0;
    let base_imponible = 0;
    let iva = 0;
    let total = 0;

    filteredProducts.forEach((item) => {
      const monto = parseFloat(item.precio) || 0;
      subtotal += monto;
      base_imponible += monto;
      iva += monto * 0.16; // IVA del 16%
      total += monto * 1.16;
    });

    return {
      subtotal: subtotal.toFixed(2),
      base_imponible: base_imponible.toFixed(2),
      iva: 16,
      total: total.toFixed(2),
    };
  };

  // useEffect que se ejecuta cuando filteredProducts o numDocument cambian
  useEffect(() => {
    const actualizarFooter = async () => {
      try {
        const totales = calcularTotales();

        // Buscar si ya existe un footer para este documento
        const resultados = await getFootersByFieldId(numDocument);

        if (resultados && resultados.length > 0) {
          // Existe → Actualizar
          const footerExistente = resultados[0];
          await updateFooter(footerExistente.id, {
            ...totales,
            footer_documento: numDocument,
          });
        } else {
          // No existe → Guardar nuevo
          await saveFooter({
            ...totales,
            footer_documento: numDocument,
          });
        }

        // Volver a cargar los datos actualizados del footer
        const nuevosDatos = await getFootersByFieldId(numDocument);
        setFooter(nuevosDatos[0] || null); // Actualizamos el estado local
      } catch (error) {
        console.error("Error al guardar o actualizar el footer:", error);
        setFooter(null);
      }
    };

    actualizarFooter();
  }, [filteredProducts, numDocument]); // ← Este efecto se dispara cuando cambia alguno de estos

  // Mostrar loader mientras carga
  if (!footer) {
    return (
      <div className="text-center py-4 text-gray-500">
        Cargando totales...
      </div>
    );
  }

  return (
    <div className="border-t border-gray-300 pt-4">
      {/* Tabla para escritorio */}
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
              <td className="text-center border border-gray-300">{footer?.subtotal}</td>
              <td className="text-center border border-gray-300">{footer?.base_imponible}</td>
              <td className="text-center border border-gray-300">{footer?.iva}%</td>
              <td className="text-center border border-gray-300 font-bold">{footer?.total}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Diseño vertical para móvil */}
      <div className="md:hidden space-y-3">
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Subtotal:</span>
          <span className="font-semibold">{footer?.subtotal}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">Base Imponible:</span>
          <span className="font-semibold">{footer?.base_imponible}</span>
        </div>
        <div className="flex justify-between border-b pb-2">
          <span className="font-medium text-gray-600">IVA ({footer?.iva}%):</span>
          <span className="font-semibold">{footer?.iva}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>{footer?.total}</span>
        </div>
      </div>
    </div>
  );
};