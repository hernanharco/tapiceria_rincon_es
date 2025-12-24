import { useEffect } from "react";
import useDocuments from "../hooks/useDocuments";
import { formatDateFor } from "../../../utils/formatUtils";

export const DocumentsInfo = ({
  cif,
  datInfo,
  setDatInfo,
  isEditing,
  selectedItem,
}) => {
  const { getAllDocuments } = useDocuments();

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
     solo cuando cambia la fecha
     y NO estamos editando
  ============================ */

  useEffect(() => {
    if (!datInfo.dataInfoDate || isEditing) return;

    const fetchClientDocuments = async () => {
      try {
        const response = await getAllDocuments();

        if (!Array.isArray(response) || response.length === 0) {
          setDatInfo((prev) => ({
            ...prev,
            dataInfoDocument: formatDateFor("PRE", prev.dataInfoDate),
          }));
          return;
        }

        const lastDocument = response[response.length - 1];
        const lastCode = lastDocument.num_presupuesto;

        const match = lastCode.match(/(\d+)$/);
        if (!match) {
          setDatInfo((prev) => ({
            ...prev,
            dataInfoDocument: formatDateFor("PRE", prev.dataInfoDate),
          }));
          return;
        }

        const counter = parseInt(match[1], 10) + 1;
        const baseCode = lastCode.slice(0, -match[1].length);
        const nextCode = baseCode + counter.toString().padStart(2, "0");

        setDatInfo((prev) => ({
          ...prev,
          dataInfoDocument: nextCode,
        }));
      } catch (error) {
        console.error("Error al generar presupuesto:", error);
      }
    };

    fetchClientDocuments();
  }, [datInfo.dataInfoDate, isEditing, getAllDocuments, setDatInfo]);

  return (
    <div>
      {/* Num Presupuesto */}
      <div className="mb-3">
        <label className="block text-sm font-semibold text-gray-700">
          Num. Presupuesto
        </label>
        <input
          type="text"
          value={datInfo.dataInfoDocument || "Cargando..."}
          readOnly
          className="w-full px-3 py-2 bg-gray-100 border rounded-md"
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
