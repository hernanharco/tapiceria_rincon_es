// src/utils/fetchClientDocuments.js

import { format } from "date-fns";

/**
 * Obtiene el siguiente número consecutivo para un tipo de documento
 * @param {{namecod: string, getAllDocuments: Function}} params
 * @returns {Promise<string>}
 */
export const codegenerator = async ({ namecod, getAllDocuments }) => {
  try {
    const response = await getAllDocuments(); // Ejecutamos getAllDocuments como función
    const today = new Date();
    const formattedDate = format(today, "yyMMd"); // Ejemplo: 240705

    if (!Array.isArray(response) || response.length === 0) {
      // Si no hay documentos, generamos uno nuevo basado en la fecha
      return `${namecod}${formattedDate}01`;
    }

    // Buscar el último documento por orden descendente
    const sortedDocs = [...response].sort((a, b) => {
      const dateA = new Date(a.fecha_factalb).getTime() || 0;
      const dateB = new Date(b.fecha_factalb).getTime() || 0;
      return dateB - dateA;
    });

    const lastDoc = sortedDocs[0];
    let lastCode;

    if (namecod === "ALB") {
      lastCode = lastDoc.num_albaran;
    } else {
      lastCode = lastDoc.num_factura;
    }

    if (!lastCode) {
      return `${namecod}${formattedDate}01`;
    }

    // Extraer solo los dígitos finales para incrementar
    const match = lastCode.match(/(\d+)$/);
    if (!match) {
      return `${namecod}${formattedDate}01`;
    }

    const currentNumber = parseInt(match[1], 10);
    const nextNumber = currentNumber + 1;
    const paddedNextNumber = nextNumber.toString().padStart(2, "0");

    // Mantener la parte fija del código
    const baseCode = lastCode.slice(0, -match[1].length);

    return `${baseCode}${paddedNextNumber}`;
  } catch (error) {
    console.error("Error al obtener documentos:", error);
    const formattedDate = format(new Date(), "yyMMd");
    return `${namecod}${formattedDate}01`;
  }
};