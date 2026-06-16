import useDocuments from '@/features/documents/hooks/useDocuments';
import { codegenerator } from '@/utils/codegenerator';

/**
 * Hook personalizado para manejar checklist de documentos
 */
export const useHistoryTableDocument = () => {
  // 1. Extraemos 'documents' (el array de datos) en lugar de 'getAllDocuments'
  const { fetchDocumentById, updateDocumentFieldsId, documents } =
    useDocuments();

  /**
   * Marca un documento como completado: asigna fecha y genera albarán y factura
   */
  const toggleChecklistItemProvider = async (itemId, documentDate, opc) => {
    if (!itemId || !documentDate) return;

    //console.log("Ejecutando toggleChecklistItemProvider:", { itemId, documentDate, opc });

    try {
      const doc = await fetchDocumentById(itemId);
      if (!doc) throw new Error(`Documento con ID "${itemId}" no encontrado`);

      // Generar números de albarán o factura
      if (opc === '1') {
        // 2. Pasamos el array 'documents' directamente al generador
        const datAlbaran = await codegenerator({
          namecod: 'ALB',
          getAllDocuments: documents,
        });

        await updateDocumentFieldsId(itemId, {
          fecha_factalb: documentDate,
          num_albaran: datAlbaran,
        });
      } else {
        const datFactura = await codegenerator({
          namecod: 'FAC',
          // 2. Pasamos el array 'documents' directamente al generador
          getAllDocuments: documents,
        });

        await updateDocumentFieldsId(itemId, {
          datefactura: documentDate,
          num_factura: datFactura,
        });
      }

      return doc;
    } catch (error) {
      console.error('Error al actualizar documento:', error);
    }
  };

  /**
   * Desmarca un documento como completado: limpia los campos
   */
  const toggleChecklistItemFalse = async (itemId, opc) => {
    if (!itemId) return;

    try {
      if (opc === '1') {
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
    } catch (error) {
      console.error('Error al limpiar documento:', error);
    }
  };

  return {
    toggleChecklistItemProvider,
    toggleChecklistItemFalse,
  };
};

export default useHistoryTableDocument;
