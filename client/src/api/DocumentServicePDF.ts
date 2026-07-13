import api from './config.js';

export const DocumentServicePDF = {
  /**
   * Generar la URL completa para el PDF.
   * Usamos la baseURL definida en la instancia de axios 'api'.
   */
  generateDocUrl: (numero) => {
    if (!numero || numero === '-') return null;
    const baseURL = api.defaults.baseURL;
    // Cache-busting: timestamp para evitar que el navegador móvil
    // sirva un PDF viejo de su caché cuando la URL es la misma.
    const cacheBust = Date.now();
    return `${baseURL}/api/documents/print/${numero}/?_=${cacheBust}`;
  },

  /**
   * Abre el PDF en una pestaña nueva aprovechando la instancia de api
   */
  print: (numero) => {
    const url = DocumentServicePDF.generateDocUrl(numero);
    if (url) {
      window.open(url, '_blank');
    } else {
      console.error('No se pudo generar la URL para el número:', numero);
    }
  },

  /**
   * Envío por WhatsApp.
   * Mantenemos la lógica de construcción de mensaje con las URLs de la instancia api.
   */
  sendWhatsApp: (docsSeleccionados, options) => {    
    // 1. Agrupamos por cliente
    const gruposPorCliente = docsSeleccionados.reduce((acc, doc) => {
      const clienteId = doc.dataclient;
      if (!acc[clienteId]) {
        acc[clienteId] = {
          nombre: doc.clienteNombre || 'Cliente',
          telefono: (options.customPhone || '634405549').replace(/\D/g, ''),
          documentos: [],
        };
      }
      acc[clienteId].documentos.push(doc);
      return acc;
    }, {});

    // 2. Procesamos cada grupo
    Object.values(gruposPorCliente).forEach((grupo, index) => {
      let mensaje = `*Hola ${(grupo as any).nombre.toUpperCase()},*%0A`;
      mensaje += `Le envío los documentos de *Tapicería Rincón*:%0A%0A`;

      // Variable para rastrear si realmente añadimos algún link al mensaje
      let tieneContenido = false;

      (grupo as any).documentos.forEach((doc) => {
        // --- LA CLAVE ESTÁ AQUÍ: Evaluamos cada campo por separado ---
        const checks = [
          {
            key: 'num_presupuesto',
            option: options.sendPre,
            label: 'Presupuesto',
            emoji: '📄',
          },
          {
            key: 'num_albaran',
            option: options.sendAlb,
            label: 'Albarán',
            emoji: '🚚',
          },
          {
            key: 'num_factura',
            option: options.sendFac,
            label: 'Factura',
            emoji: '💰',
          },
        ];

        checks.forEach((check) => {
          const valorField = doc[check.key];
          // Solo si: hay número Y la opción en el modal está marcada (true)
          if (valorField && valorField !== '-' && check.option === true) {
            const url = DocumentServicePDF.generateDocUrl(valorField);
            mensaje += `${check.emoji} *${check.label} ${valorField}:*%0A${url}%0A%0A`;
            tieneContenido = true;
          }
        });
      });

      mensaje += `_Gracias por su confianza._`;

      // 3. Solo abrimos WhatsApp si el mensaje tiene al menos un documento
      if (tieneContenido) {
        setTimeout(() => {
          const waUrl = `https://wa.me/${(grupo as any).telefono}?text=${mensaje}`;
          window.open(waUrl, '_blank');
        }, index * 1200);
      }
    });
  },
};
