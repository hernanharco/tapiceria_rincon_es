import { useEffect } from "react";
// Importamos el hook que contiene los datos ya cargados
import { useApiDocumentsContext } from "@/modules/documents/context/DocumentsProvider";
import { formatDateFor } from "@/utils/formatUtils";

export const DocumentsInfo = ({
  cif,
  datInfo,
  setDatInfo,
  isEditing,
  selectedItem,
}) => {
  // Extraemos 'documents' del contexto en lugar de llamar a una función async
  const { documents } = useApiDocumentsContext();

  /* ===========================
      Inicializar datos en edición
  ============================ */
  useEffect(() => {
    if (isEditing && selectedItem) {
      setDatInfo({
        dataInfoDocument: selectedItem.num_presupuesto || "",
        dataInfoDate: selectedItem.fecha_factura || "",
        dataInfoObservation: selectedItem.observaciones || "",
      });
    }
  }, [isEditing, selectedItem, setDatInfo]);

  /* ===========================
      Generar número de presupuesto
      Lógica síncrona (Instantánea)
  ============================ */
  useEffect(() => {
    // Si no hay fecha o estamos editando, no generamos número nuevo
    if (!datInfo.dataInfoDate || isEditing) return;

    // Usamos 'documents' que ya vienen del Provider optimizado
    if (!Array.isArray(documents) || documents.length === 0) {
      setDatInfo((prev) => ({
        ...prev,
        dataInfoDocument: formatDateFor("PRE", prev.dataInfoDate),
      }));
      return;
    }

    // Obtenemos el último documento de la lista en memoria
    const lastDocument = documents[documents.length - 1];
    const lastCode = lastDocument.num_presupuesto;

    if (!lastCode) return;

    const match = lastCode.match(/(\d+)$/);
    if (!match) {
      setDatInfo((prev) => ({
        ...prev,
        dataInfoDocument: formatDateFor("PRE", prev.dataInfoDate),
      }));
      return;
    }

    // Incrementamos el contador
    const counter = parseInt(match[1], 10) + 1;
    const baseCode = lastCode.slice(0, -match[1].length);
    const nextCode = baseCode + counter.toString().padStart(2, "0");

    setDatInfo((prev) => ({
      ...prev,
      dataInfoDocument: nextCode,
    }));

    // Nota: Eliminamos getAllDocuments de las dependencias
  }, [datInfo.dataInfoDate, isEditing, documents, setDatInfo]);

  return (
    <div>
      {/* Num Presupuesto */}
      <div className="mb-3">
        <label className="block text-sm font-semibold text-gray-700">
          Num. Presupuesto
        </label>
        <input
          type="text"
          value={datInfo.dataInfoDocument || "Generando..."}
          readOnly
          className="w-full px-3 py-2 bg-gray-100 border rounded-md font-mono"
        />
      </div>

      {/* Fecha Presupuesto */}
      <div className="mb-3">
        <label className="block text-sm font-semibold text-gray-700">
          Fecha Presupuesto
        </label>
        <input
          type="date"
          value={datInfo.dataInfoDate || ""}
          onChange={(e) =>
            setDatInfo((prev) => ({
              ...prev,
              dataInfoDate: e.target.value,
            }))
          }
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Código Cliente */}
      <div className="mb-3">
        <label className="block text-sm font-semibold text-gray-700">
          Cod. Cliente
        </label>
        <input
          type="text"
          value={cif}
          readOnly
          className="w-full px-3 py-2 bg-gray-100 border rounded-md"
        />
      </div>

      {/* Observaciones */}
      <div className="mb-3">
        <label className="block text-sm font-semibold text-gray-700">
          Observaciones
        </label>
        <textarea
          value={datInfo.dataInfoObservation || ""}
          onChange={(e) =>
            setDatInfo((prev) => ({
              ...prev,
              dataInfoObservation: e.target.value,
            }))
          }
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Escribe aquí tus observaciones..."
        />
      </div>
    </div>
  );
};