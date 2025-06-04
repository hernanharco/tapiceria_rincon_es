// documents_info.jsx

import useDocuments from '../../hooks/useDocuments';

export const DocumentsInfo = () => {

    const { documents } = useDocuments();

    // Validación extra: aseguramos que sea un array
    if (!Array.isArray(documents) || documents.length === 0) {
        return null;
    }

    const document = documents[0];

    return (
        <div className="space-y-2">
            <p className="text-sm font-semibold text-gray-700">Num. Factura. <span className="font-normal">{document.num_factura}</span>
            </p>
            <p className="text-sm font-semibold text-gray-700">
                Fecha Factura. <span className="font-normal">{document.fecha_factura}</span>
            </p>
            <p className="text-sm font-semibold text-gray-700">
                Cod. Cliente. <span className="font-normal">{document.cod_cliente}</span>
            </p>
            <p className="text-sm font-semibold text-gray-700">
                Observaciones. <span className="font-normal">{document.observaciones}</span>
            </p>
        </div>
    );
};