import { useEffect } from 'react';
// Importamos el hook que contiene los datos ya cargados
import { useApiDocumentsContext } from '@/context/DocumentsProvider';
import { formatDateFor } from '@/utils/formatUtils';

export const DocumentsInfo = ({
  cif,
  datInfo,
  setDatInfo,
  isEditing,
  selectedItem,
}) => {
  // Extraemos 'documents' del contexto
  const { documents } = useApiDocumentsContext();

  /* ===========================
      Inicializar datos en edición
  ============================ */
  useEffect(() => {
    if (isEditing && selectedItem) {
      setDatInfo({
        dataInfoDocument: selectedItem.num_presupuesto || '',
        dataInfoDate: selectedItem.fecha_factura || '',
        dataInfoObservation: selectedItem.observaciones || '',
      });
    }
  }, [isEditing, selectedItem, setDatInfo]);

  /* ===========================
      Generar número de presupuesto
      Lógica mejorada para encontrar el MÁXIMO real
  ============================ */
  useEffect(() => {
    if (!datInfo.dataInfoDate || isEditing) return;

    if (!Array.isArray(documents) || documents.length === 0) {
      setDatInfo((prev) => ({
        ...prev,
        dataInfoDocument: formatDateFor('PRE', prev.dataInfoDate),
      }));
      return;
    }

    // 1. Mapeamos todos los números de presupuesto y extraemos su valor numérico
    // Esto evita depender del orden en que llegan de la base de datos
    const numericValues = documents
      .map((doc) => {
        const match = doc.num_presupuesto?.match(/(\d+)$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter((val) => !isNaN(val));

    // 2. Obtenemos el número más alto encontrado
    const maxNumber = numericValues.length > 0 ? Math.max(...numericValues) : 0;

    // 3. Si no encontramos números previos, usamos el formato base
    if (maxNumber === 0) {
      setDatInfo((prev) => ({
        ...prev,
        dataInfoDocument: formatDateFor('PRE', prev.dataInfoDate),
      }));
      return;
    }

    // 4. Generamos el siguiente código (PRE + Año + Incremento)
    // Basándonos en tu captura, parece que el formato es PRE + Año (25) + Contador (00xx)
    const nextNumber = maxNumber + 1;
    // console.log("nextNumber - DocumentsInfo.jsx", nextNumber);
    // Asumiendo que quieres mantener el prefijo "PRE" y el formato visto en consola
    // Si maxNumber era 250035, nextNumber será 250036
    setDatInfo((prev) => ({
      ...prev,
      dataInfoDocument: `PRE${nextNumber}`,
    }));
  }, [datInfo.dataInfoDate, isEditing, documents, setDatInfo]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Num Presupuesto */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold text-gray-700">
            Num. Presupuesto
          </label>
          <input
            type="text"
            value={datInfo.dataInfoDocument || 'Generando...'}
            readOnly
            className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg font-mono text-blue-700 focus:outline-none ring-1 ring-gray-200"
          />
        </div>

        {/* Fecha Presupuesto */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-semibold text-gray-700">
            Fecha Presupuesto
          </label>
          <input
            type="date"
            value={datInfo.dataInfoDate || ''}
            onChange={(e) =>
              setDatInfo((prev) => ({
                ...prev,
                dataInfoDate: e.target.value,
              }))
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      {/* Código Cliente */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-semibold text-gray-700">
          Cod. Cliente
        </label>
        <input
          type="text"
          value={cif}
          readOnly
          className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-600"
        />
      </div>

      {/* Observaciones */}
      <div className="flex flex-col">
        <label className="mb-1 text-sm font-semibold text-gray-700">
          Observaciones
        </label>
        <textarea
          value={datInfo.dataInfoObservation || ''}
          onChange={(e) =>
            setDatInfo((prev) => ({
              ...prev,
              dataInfoObservation: e.target.value,
            }))
          }
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
          placeholder="Notas adicionales..."
        />
      </div>
    </div>
  );
};
