//import { format } from "date-fns";

/**
 * Función auxiliar para generar un código inicial basado en la fecha.
 * Ejemplo: ALB + 25 (año) + 12 (mes) + 01 = ALB251201
 */
const formatDateFor = (prefix, date = new Date()) => {
  const year = date.getFullYear().toString().slice(-2); 
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${prefix}${year}${month}01`; 
};

/**
 * Obtiene el siguiente número consecutivo para un tipo de documento.
 * @param {{namecod: string, getAllDocuments: Array}} params 
 * @returns {Promise<string>}
 */
export const codegenerator = async ({ namecod, getAllDocuments }) => {
  try {
    // 💡 CAMBIO CRUCIAL: 'getAllDocuments' ahora es el array directo.
    // Ya no hacemos: await getAllDocuments();
    const documents = getAllDocuments;

    // Validación de que tenemos un array válido
    if (!Array.isArray(documents) || documents.length === 0) {
      return formatDateFor(namecod);
    }

    // 1. Filtrar documentos que tengan un código que empiece con el prefijo (ALB o FAC)
    const relevantDocs = documents.filter((doc) => {
      let code = "";
      if (namecod === "ALB") {
        code = doc.num_albaran || "";
      } else if (namecod === "FAC") {
        code = doc.num_factura || "";
      } else {
        code = doc.num_factura || doc.num_albaran || "";
      }
      // Debe empezar con el prefijo y contener al menos un número
      return code.startsWith(namecod) && /\d/.test(code);
    });

    if (relevantDocs.length === 0) {
      return formatDateFor(namecod);
    }

    // 2. Extraer el número más alto encontrado en la lista
    let maxNumber = 0;

    relevantDocs.forEach((doc) => {
      const code = namecod === "ALB" ? doc.num_albaran : doc.num_factura;
      if (!code) return;

      // Usamos Regex para capturar solo los dígitos que siguen al prefijo
      // Ejemplo: de "ALB250044" captura "250044"
      const match = code.match(new RegExp(`${namecod}(\\d+)$`));
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    // 3. Generar el siguiente número
    if (maxNumber > 0) {
      const nextNumber = maxNumber + 1;
      
      // Mantenemos el mismo relleno de ceros que el original
      // Si el máximo era 250044, el siguiente será 250045
      const numDigits = maxNumber.toString().length;
      const paddedNext = nextNumber.toString().padStart(numDigits, "0");
      
      return `${namecod}${paddedNext}`;
    } else {
      return formatDateFor(namecod);
    }
  } catch (error) {
    console.error("Error crítico en codegenerator:", error);
    // Fallback de seguridad para no dejar el campo vacío
    return formatDateFor(namecod);
  }
};