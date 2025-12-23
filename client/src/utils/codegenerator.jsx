// src/utils/fetchClientDocuments.js
import { format } from "date-fns";

// Función auxiliar para formatear con fecha (si se necesita como fallback)
const formatDateFor = (prefix, date = new Date()) => {
  const year = date.getFullYear().toString().slice(-2); // Últimos 2 dígitos del año
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${prefix}${year}${month}01`; // Ej: ALB250401
};

/**
 * Obtiene el siguiente número consecutivo para un tipo de documento
 * @param {{namecod: string, getAllDocuments: Function}} params
 * @returns {Promise<string>}
 */
export const codegenerator = async ({ namecod, getAllDocuments }) => {
  try {
    const documents = await getAllDocuments();

    if (!Array.isArray(documents) || documents.length === 0) {
      return formatDateFor(namecod);
    }

    // Filtrar documentos que tengan un código que empiece con namecod
    const relevantDocs = documents.filter((doc) => {
      let code = "";
      if (namecod === "ALB") {
        code = doc.num_albaran || "";
      } else if (namecod === "FAC") {
        code = doc.num_factura || "";
      } else {
        // Si usas otros prefijos, ajusta aquí
        code = doc.num_factura || doc.num_albaran || "";
      }
      return code.startsWith(namecod) && /\d/.test(code); // debe tener al menos un dígito
    });

    if (relevantDocs.length === 0) {
      return formatDateFor(namecod);
    }

    // Extraer el número más alto
    let maxNumber = 0;
    let basePrefix = namecod;

    relevantDocs.forEach((doc) => {
      const code = namecod === "ALB" ? doc.num_albaran : doc.num_factura;
      if (!code) return;

      // Extraer solo los dígitos al final
      const match = code.match(new RegExp(`${namecod}(\\d+)$`));
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
          // Opcional: guardar el prefijo exacto si varía (pero asumimos que es fijo)
        }
      }
    });

    if (maxNumber > 0) {
      const nextNumber = maxNumber + 1;
      // Aseguramos el mismo número de dígitos que el original (ej: 250008 → 6 dígitos)
      const numDigits = maxNumber.toString().length;
      const paddedNext = nextNumber.toString().padStart(numDigits, "0");
      return `${namecod}${paddedNext}`;
    } else {
      return formatDateFor(namecod);
    }
  } catch (error) {
    console.error("Error en codegenerator:", error);
    return "";
  }
};