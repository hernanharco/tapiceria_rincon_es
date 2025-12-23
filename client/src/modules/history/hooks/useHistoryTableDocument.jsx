// src/hooks/useChecklist.js

import useDocuments from "../../documents/hooks/useDocuments";
import { codegenerator } from "../../../utils/codegenerator"; // Importamos desde otro archivo

/**
 * Hook personalizado para manejar checklist de documentos
 */
export const useHistoryTableDocument = () => {
  const { fetchDocumentById, updateDocumentFieldsId, getAllDocuments } =
    useDocuments();

  /**
   * Marca un documento como completado: asigna fecha y genera albarán y factura
   */
  const toggleChecklistItemProvider = async (itemId, documentDate, opc) => {
    if (!itemId || !documentDate) return;

    // console.log("estoy en useHistoryTableDocument.jsx: ", "itemId",itemId, "documentDate",documentDate, "opc",opc);

    try {
      const doc = await fetchDocumentById(itemId);
      if (!doc) throw new Error(`Documento con ID "${itemId}" no encontrado`);

      // Generar números de albarán y factura
      if (opc === "1") {
        const datAlbaran = await codegenerator({
          namecod: "ALB",
          getAllDocuments,
        });
        console.log("datAlbaran: ", datAlbaran);
        await updateDocumentFieldsId(itemId, {
          fecha_factalb: documentDate,
          num_albaran: datAlbaran,
        });
      } else {
        const datFactura = await codegenerator({
          namecod: "FAC",
          getAllDocuments,
        });
        // console.log("datFactura: ", datFactura);
        await updateDocumentFieldsId(itemId, {
          datefactura: documentDate,
          num_factura: datFactura,
        });
      }

      // console.log("Documento actualizado:", itemId);
      return doc;
    } catch (error) {
      console.error("Error al actualizar documento:", error);
    }
  };

  /**
   * Desmarca un documento como completado: limpia los campos
   */
  const toggleChecklistItemFalse = async (itemId, opc) => {
    if (!itemId) return;

    try {
      if(opc==="1"){
        await updateDocumentFieldsId(itemId, {
          fecha_factalb: null,
          num_albaran: null,
          num_factura: null,
        });
      } else {
         await updateDocumentFieldsId(itemId, {
          datefactura: null,          
          num_factura: null,
        });
      }

      // console.log("Documento desmarcado:", itemId);
    } catch (error) {
      console.error("Error al limpiar documento:", error);
    }
  };

  return {
    toggleChecklistItemProvider,
    toggleChecklistItemFalse,
  };
};

export default useHistoryTableDocument;
