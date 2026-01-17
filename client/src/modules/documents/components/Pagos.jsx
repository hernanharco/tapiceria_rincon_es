
// src/components/pagos/Pagos.jsx

import usePagos from '../../hooks/usePagos';

export const Pagos = () => {

    const { pagos } = usePagos();    

    // Validación segura: si no hay datos, no mostramos nada
    if (!Array.isArray(pagos) || pagos.length === 0) return null;

    const pago = pagos[0];    

    return (
        <div className="border border-gray-300 rounded-lg bg-white shadow-sm p-4 max-w-md">
            <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
                <tbody>                    
                    <tr>
                        <td style={{ width: '100%' }} className="text-gray-800 py-2 px-4 whitespace-pre-line">
                            {pago.forma_pago}                            
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
