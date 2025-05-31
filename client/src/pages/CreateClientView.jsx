import { useState } from 'react';
import { CreateClientsModal } from '../components/clients/CreateClientsModal';

// Hooks personalizados
import { useClients } from '../hooks/useClients';
import { useCompany } from '../hooks/useCompany';

export const CreateClientView = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const { clientes, addClients, deleteClients, updateClients, refetchclientes } = useClients();
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

      await refetchclientes(); // ✅ Recarga clientes solo si todo fue bien
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
        await refetchclientes(); // ✅ Refresca la lista inmediatamente
      } catch (err) {
        alert("No se pudo eliminar el cliente.");
      }
    }
  };

  return (
    <div className="p-6">
      {/* Botón Nuevo Cliente */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Clientes</h2>
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

      {/* Tabla de Clientes - Responsive */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left hidden md:table-cell">CIF</th>
              <th className="py-3 px-6 text-left">Nombre</th>
              <th className="py-3 px-6 text-left hidden md:table-cell">Dirección</th>
              <th className="py-3 px-6 text-right hidden md:table-cell">Cod. Postal</th>
              <th className="py-3 px-6 text-right hidden md:table-cell">Ciudad</th>
              <th className="py-3 px-6 text-right hidden md:table-cell">Teléfono</th>
              <th className="py-3 px-6 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {clientes.length > 0 ? (
              clientes.map((client, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-100 transition-colors duration-150">
                  <td className="py-3 px-6 text-left whitespace-nowrap hidden md:table-cell">{client.cif}</td>
                  <td className="py-3 px-6 text-left">{client.name}</td>
                  <td className="py-3 px-6 text-left hidden md:table-cell">{client.address}</td>
                  <td className="py-3 px-6 text-left hidden md:table-cell">{client.zip_code}</td>
                  <td className="py-3 px-6 text-left hidden md:table-cell">{client.city}</td>
                  <td className="py-3 px-6 text-left hidden md:table-cell">{client.phone}</td>
                  <td className="py-3 px-6 text-right flex justify-end space-x-2">
                    <button
                      type='button'
                      onClick={() => {
                        setEditingClient(client);
                        setShowModal(true);
                      }}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.cif)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 text-center text-gray-500">
                  No hay clientes registrados
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