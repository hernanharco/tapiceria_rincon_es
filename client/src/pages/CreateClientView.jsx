import { useState } from 'react';
import { CreateClientsModal } from '../modules/clients/CreateClientsModal';

// Hooks personalizados
import useClients from '../modules/clients/hooks/useClients';
import useCompany from '../modules/company/hooks/useCompany';

export const CreateClientView = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingClient, setEditingClient] = useState(null);

  const { clients, addClients, deleteClients, updateClients, refetchClients } = useClients();
  const { empresas } = useCompany();

  // Manejador de guardar/editar cliente
  const handleSaveClient = async (cliente) => {
    // console.log("Datos del isEditing:", cliente.isEditing);

    try {
      if (cliente.isEditing) {
        console.log("Actualizando cliente:", cliente.cif, cliente);
        await updateClients(cliente.cif, cliente); // ✅ Usamos 'cif' como identificador
      } else {
        console.log("Guardando nuevo cliente:", cliente);
        await addClients(cliente);
      }

      await refetchClients();
      setShowModal(false);
      setEditingClient(null);

    } catch (err) {
      alert(`❌ Error al ${cliente.isEditing ? 'actualizar' : 'guardar'} el cliente.\n${err.message}`);
    }
  };

  const handleDeleteClient = async (cif) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await deleteClients(cif); // Elimina por CIF
        await refetchClients(); // Recarga inmediatamente
      } catch (err) {
        alert("No se pudo eliminar el cliente.");
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto">
      {/* Título y botón */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Clientes</h2>
        <button
          onClick={() => {
            setEditingClient(null);
            setShowModal(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow w-full sm:w-auto"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Tabla en desktop / Lista en móvil */}
      <div className="overflow-x-auto">
        {/* Tabla para pantallas grandes */}
        <table className="hidden md:table w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold text-sm">
              <th className="px-2 py-2 border border-gray-300 text-center">CIF</th>
              <th className="px-2 py-2 border border-gray-300 text-center">Codigo Cliente</th>
              <th className="px-2 py-2 border border-gray-300 text-center">Nombre</th>
              <th className="px-2 py-2 border border-gray-300 text-center">Dirección</th>
              <th className="px-2 py-2 border border-gray-300 text-center">Cod. Postal</th>
              <th className="px-2 py-2 border border-gray-300 text-center">Ciudad</th>
              <th className="px-2 py-2 border border-gray-300 text-center">Teléfono</th>
              <th className="px-2 py-2 border border-gray-300 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm font-light">
            {clients.length > 0 ? (
              clients.map((client, idx) => (
                <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-2 py-2 border border-gray-300 text-center">{client.cif}</td>
                  <td className="px-2 py-2 border border-gray-300 text-center">{client.cod_client || '-'}</td>
                  <td className="px-2 py-2 border border-gray-300">{client.name}</td>
                  <td className="px-2 py-2 border border-gray-300">{client.address}</td>
                  <td className="px-2 py-2 border border-gray-300 text-center">{client.zip_code}</td>
                  <td className="px-2 py-2 border border-gray-300">{client.city}</td>
                  <td className="px-2 py-2 border border-gray-300 text-center">{client.number}</td>
                  <td className="px-2 py-2 text-center border border-gray-300">
                    <div className="flex justify-center space-x-3">
                      <button
                        type="button"
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
                <td colSpan="8" className="py-4 text-center text-gray-500">
                  No hay clientes registrados
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Diseño responsivo para móviles */}
        <div className="md:hidden space-y-4">
          {clients.length > 0 ? (
            clients.map((client, idx) => (
              <div
                key={idx}
                className="p-3 border border-gray-300 rounded-lg shadow-sm bg-gray-50"
              >
                <div className="space-y-1">
                  <p><span className="font-semibold text-gray-700">Nombre:</span> {client.name}</p>
                  <p><span className="font-semibold text-gray-700">CIF:</span> {client.cif}</p>
                  <p><span className="font-semibold text-gray-700">Teléfono:</span> {client.number}</p>
                  <p><span className="font-semibold text-gray-700">Dirección:</span> {client.address}</p>
                </div>
                <div className="mt-2 flex justify-center gap-3 pt-2 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setEditingClient(client);
                      setShowModal(true);
                    }}
                    className="text-yellow-500 hover:text-yellow-700"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDeleteClient(client.cif)}
                    className="text-red-500 hover:text-red-700"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-4">No hay clientes registrados</p>
          )}
        </div>
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
          company={empresas[0]?.cif || null}
        />
      )}
    </div>
  );
};