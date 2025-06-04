import { useState } from 'react';
import { CreateClientsModal } from '../components/clients/CreateClientsModal';

// Hooks personalizados
import useClients from '../hooks/useClients';
import useCompany from '../hooks/useCompany';

export const CreateClientView = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const { clients, addClients, deleteClients, updateClients, refetchclients } = useClients();
  const { empresas } = useCompany();
  // console.log('Empresas disponibles:', empresas[0].cif); // ✅ Verificamos el ID de la empresa

  // Manejador de guardar/editar cliente
  const handleSaveClient = async (cliente) => {
    try {
      if (cliente.id) {
        await updateClients(cliente.id, cliente); // ✅ Llama a la función con datos completos
      } else {
        await addClients(cliente); // ✅ Llama a la función con datos del cliente        
      }

      await refetchclients(); // ✅ Recarga clients solo si todo fue bien
      setShowModal(false);
      setEditingClient(null);

    } catch (err) {
      // ✅ Aquí entra SOLO si hubo un error real
      alert(`❌ Error al ${cliente.id ? 'actualizar' : 'guardar'} el cliente.\n${err.message}`);
    }
  };

  const handleDeleteClient = async (cif) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await deleteClients(cif); // ✅ Elimina por CIF
        await refetchclients(); // ✅ Refresca la lista inmediatamente
      } catch (err) {
        alert("No se pudo eliminar el cliente.");
      }
    }
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-4xl mx-auto">
      {/* Botón Nuevo Cliente */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">clients</h2>
        <button
          onClick={() => {
            setEditingClient(null);
            setShowModal(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Tabla de clients - Responsive */}
      <div className="w-full overflow-hidden">
        <table className="hidden md:table w-full table-auto border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold">
              <th className="px-2 py-1 border border-gray-300 text-center hidden md:table-cell">CIF</th>
              <th className="px-2 py-1 border border-gray-300 text-center">Nombre</th>
              <th className="px-2 py-1 border border-gray-300 text-center hidden md:table-cell">Dirección</th>
              <th className="px-2 py-1 border border-gray-300 text-center hidden md:table-cell">Cod. Postal</th>
              <th className="px-2 py-1 border border-gray-300 text-center hidden md:table-cell">Ciudad</th>
              <th className="px-2 py-1 border border-gray-300 text-center hidden md:table-cell">Teléfono</th>
              <th className="px-2 py-1 border border-gray-300 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {clients.length > 0 ? (
              clients.map((client, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150">
                  <td className="px-2 py-1 border border-gray-300 text-center whitespace-nowrap hidden md:table-cell">{client.cif}</td>
                  <td className="px-2 py-1 border border-gray-300 text-center">{client.name}</td>
                  <td className="px-2 py-1 border border-gray-300 text-center hidden md:table-cell">{client.address}</td>
                  <td className="px-2 py-1 border border-gray-300 text-center hidden md:table-cell">{client.zip_code}</td>
                  <td className="px-2 py-1 border border-gray-300 text-center hidden md:table-cell">{client.city}</td>
                  <td className="px-2 py-1 border border-gray-300 text-center hidden md:table-cell">{client.number}</td>
                   <td className="px-2 py-1 text-sm text-center border border-gray-300">
                      <div className="flex justify-center space-x-2">
                      <button
                        type='button'
                        onClick={() => {
                          setEditingClient(client);
                          setShowModal(true);
                        }}
                        className="text-yellow-500 hover:text-yellow-700 no-print"
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClient(client.cif)}
                        className="text-red-500 hover:text-red-700 no-print"
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No hay clients registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal único para crear o editar */}
      {showModal && (
        <CreateClientsModal
          isOpen={true}
          onClose={() => {
            setShowModal(false);
            setEditingClient(null);
          }}
          onSubmit={handleSaveClient}
          client={editingClient}
          company={empresas[0]?.cif || null} // ✅ Pasamos el ID de la empresa       
        />
      )}
    </div>
  );
};