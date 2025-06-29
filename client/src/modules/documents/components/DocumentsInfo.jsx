import { useEffect, useState } from "react";
import useDocuments from "../hooks/useDocuments";

export const DocumentsInfo = ({ onClose, cif, datInfo, setDatInfo, isEditing, selectedItem }) => {

  const [localDocument, setLocalDocument] = useState("");
  const [localDate, setLocalDate] = useState("");
  const [localObservation, setLocalObservation] = useState("");

  const { getAllDocuments } = useDocuments();

  // Vamos a inicializar la informacion con los datos del cliente seleccionado
  useEffect(() => {
    // console.log("isEditing en DocumentsInfo: ", isEditing)    
    if(isEditing){      
      setLocalDocument(selectedItem.num_presupuesto);
      setLocalDate(selectedItem.fecha_factura);
      setLocalObservation(selectedItem.observaciones);
    }
      
  }, [isEditing])

  // Genera el siguiente número de presupuesto basado en el último código
  const generateNextPresupuestoCode = (baseCode, nextCounter) => {
    const numericSuffix = baseCode.match(/\d+$/);
    if (!numericSuffix) return baseCode + nextCounter;

    const baseWithoutCounter = baseCode.slice(0, numericSuffix.index);
    return `${baseWithoutCounter}${nextCounter}`;
  };

  // Formatea la fecha como PREyyMMDD
  const formatDateForPresupuesto = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) throw new Error("Fecha inválida");

    const year = date.getFullYear().toString().slice(-2);
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 06
    const day = String(date.getDate()).padStart(2, "0");

    return `PRE${year}${month}${day}`;
  };

  // Obtiene documentos y genera el nuevo número de presupuesto
  const fetchClientDocuments = async () => {
    if (!cif || !localDate) return;

    try {
      const indexDocuments = String(cif).trim();
      const response = await getAllDocuments();

      // Si no hay documentos, generamos el primero usando la fecha local
      if (!Array.isArray(response) || response.length === 0) {
        const formattedCode = formatDateForPresupuesto(localDate);
        setLocalDocument(formattedCode);
        return;
      }

      // Tomamos el último documento para generar el siguiente
      const lastDocument = response[response.length - 1];
      const lastCode = lastDocument.num_presupuesto;

      // Función para extraer solo los números al final
      const extractCounter = (code) => {
        const match = code.match(/(\d+)$/); // Busca uno o más dígitos al final
        return match ? parseInt(match[1], 10) : NaN;
      };

      const currentCounter = extractCounter(lastCode);

      if (!isNaN(currentCounter)) {
        const nextCounter = currentCounter + 1;

        // Separamos la parte fija (sin el número final)
        const baseCode = lastCode.slice(0, -currentCounter.toString().length);

        // Aseguramos que el contador tenga siempre 2 dígitos (ej: 1 → '01')
        const paddedCounter = nextCounter.toString().padStart(2, "0");

        const nextCode = baseCode + paddedCounter;

        setLocalDocument(nextCode);
      } else {
        // Si no tiene número al final, iniciamos con la fecha
        const formattedCode = formatDateForPresupuesto(localDate);
        setLocalDocument(formattedCode);
      }
    } catch (error) {
      console.error("Error al obtener documentos:", error);
      setLocalDocument("");
    }
  };
  
  // Llama a fetchClientDocuments cuando localDate cambian
  useEffect(() => {
    if (!isEditing) {
      fetchClientDocuments();
    }
  }, [localDate]);

  // Cada vez que cambia algun campo, actualizamos también el estado del padre
  useEffect(() => {
    setDatInfo({
      dataInfoDocument: localDocument,
      dataInfoDate: localDate,
      dataInfoObservation: localObservation,
    });
  }, [localDocument, localDate, localObservation]);

  return (
    <div>
      <details
        open={!onClose}
        className="p-4 border border-gray-300 rounded bg-gray-50"
      >
        <summary className="font-semibold text-gray-700 mb-3 cursor-pointer">
          Información del Cliente
        </summary>

        {/* Campo Num. Presupuesto */}
        <div className="mb-3">
          <label
            htmlFor="numPresupuesto"
            className="block text-sm font-semibold text-gray-700"
          >
            Num. Presupuesto.
          </label>
          <input
            id="numPresupuesto"
            type="text"
            value={localDocument || "Cargando..."}
            readOnly
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>

        {/* Campo Fecha Presupuesto */}
        <div className="mb-3">
          <label
            htmlFor="fechaPresupuesto"
            className="block text-sm font-semibold text-gray-700"
          >
            Fecha Presupuesto.
          </label>
          <input
            id="fechaPresupuesto"
            type="date"
            value={localDate}
            onChange={(e) => setLocalDate(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Campo Cod. Cliente */}
        <div className="mb-3">
          <label
            htmlFor="codCliente"
            className="block text-sm font-semibold text-gray-700"
          >
            Cod. Cliente.
          </label>
          <input
            id="codCliente"
            type="text"
            value={cif}
            readOnly
            className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md"
          />
        </div>

        {/* Campo Observaciones */}
        <div className="mb-3">
          <label
            htmlFor="observaciones"
            className="block text-sm font-semibold text-gray-700"
          >
            Observaciones.
          </label>
          <textarea
            id="observaciones"
            value={localObservation}
            onChange={(e) => setLocalObservation(e.target.value)}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Escribe aquí tus observaciones..."
          />
        </div>
      </details>
    </div>
  );
};
