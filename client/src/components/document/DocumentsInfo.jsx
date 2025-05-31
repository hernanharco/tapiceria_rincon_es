// documents_info.jsx


export const DocumentsInfo = ({ documentos }) => {

    // Validación extra: aseguramos que sea un array
    if (!Array.isArray(documentos) || documentos.length === 0) {
        return null;
    }

    const documento = documentos[0];

    return (
        <details className="space-y-2">
            <summary className="text-sm font-semibold text-gray-700">Num. Factura. <span className="font-normal">{documento.num_factura}</span>
            </summary>
            <p className="text-sm font-semibold text-gray-700">
                Fecha Factura. <span className="font-normal">{documento.fecha_factura}</span>
            </p>
            <p className="text-sm font-semibold text-gray-700">
                Cod. Cliente. <span className="font-normal">{documento.cod_cliente}</span>
            </p>
            <p className="text-sm font-semibold text-gray-700">
                Observaciones. <span className="font-normal">{documento.observaciones}</span>
            </p>
        </details>
    );
};