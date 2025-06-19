// // src/components/clients/Clients.jsx
// import useClients from "../documents/hooks/useClients";

// export const Clients = () => {

//     const { clients } = useClients();

//     // Validación segura: si no hay datos, no renderiza nada
//     if (!clients) return null;

//     const client = clients[0];

//     return (
//         <div className="space-y-2">
//             <p className="text-sm font-semibold text-gray-700">{client.name}</p>
//             <p className="text-sm text-gray-700">{client.address}</p>
//             <p className="text-sm text-gray-700">{client.zip_code} {client.city}</p>
//             <p className="text-sm text-gray-700">TFNO. {client.number}</p>

//             {/* Subtabla */}
//             <table style={{ borderCollapse: 'collapse', width: '100%' }} border="1">
//                 <tbody>
//                     <tr>
//                         <td style={{ width: '33.3333%' }} className="text-sm text-gray-700">Asturias</td>
//                         <td style={{ width: '33.3333%' }} className="text-sm text-gray-700">NIF-CIF</td>
//                         <td style={{ width: '33.3333%' }} className="text-sm text-gray-700">{client.cif}</td>
//                     </tr>
//                 </tbody>
//             </table>
//         </div>
//     );
// };

