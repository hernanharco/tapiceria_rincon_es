// src/components/clients/Clients.jsx
import { useClients } from "../../hooks/useClients";

export const Clients = () => {

    const { clientes } = useClients();

    // Validación segura: si no hay datos, no renderiza nada
    if (!clientes) return null;

    const cliente = clientes[0];

    return (
        <details className="space-y-2">
            <summary className="text-sm font-semibold text-gray-700">{cliente.name}</summary>
            <p className="text-sm text-gray-700">{cliente.address}</p>
            <p className="text-sm text-gray-700">{cliente.zip_code} {cliente.city}</p>
            <p className="text-sm text-gray-700">TFNO. {cliente.number}</p>

            {/* Subtabla */}
            <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
                <tbody>
                    <tr>
                        <td style={{ width: '33.3333%' }} className="text-sm text-gray-700">Asturias</td>
                        <td style={{ width: '33.3333%' }} className="text-sm text-gray-700">NIF-CIF</td>
                        <td style={{ width: '33.3333%' }} className="text-sm text-gray-700">{cliente.cif}</td>
                    </tr>
                </tbody>
            </table>
        </details>
    );
};

