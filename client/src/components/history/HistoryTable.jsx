import { useState, useEffect } from 'react';
import { HistoryModals } from './HistoryModals';



import useClients from '../../hooks/useClients';
import { HistoryTableDocument } from './HistoryTableDocument';

export const HistoryTable = () => {
  const [showModal, setShowModal] = useState(false);

  const {
    // Estados de búsqueda
    searchClient,
    setSearchClient,
    filteredClients,
    setFilteredClients,

    // Funciones    
    handleKeyDown,
    handleBlur } = useClients();
  // console.table("Clientes:", clients);



  return (
    <div className="space-y-6">
      {/* Campo de búsqueda de cliente */}
      <div>
        <label htmlFor="client-search" className="block text-sm font-medium text-gray-700 mb-1">
          Buscar Cliente
        </label>
        <div className="relative">
          <input
            id="client-search"
            type="text"
            placeholder="Nombre o CIF..."
            value={searchClient}
            onChange={(e) => setSearchClient(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => {
              if (searchClient.trim()) {
                console.log("Botón buscar:", searchClient);
                // Aquí puedes disparar acción real si lo deseas
              }
            }}
            className="absolute right-2 top-2 mt-1 text-gray-500 hover:text-gray-700"
            aria-label="Buscar cliente"
          >
            🔍
          </button>
        </div>

        {/* Resultados de búsqueda */}
        {searchClient && filteredClients.length > 0 && (
          <ul className="mt-2 bg-white border border-gray-300 rounded-lg shadow-sm max-h-60 overflow-y-auto z-10">
            {filteredClients.map(client => (
              <li
                key={client.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 border-gray-200"
                onClick={() => {
                  setSearchClient(`${client.name} (${client.cif})`);
                  setFilteredClients([]);
                }}
              >
                <div className="font-medium">{client.name}</div>
                <div className="text-sm text-gray-500">{client.cif}</div>
              </li>
            ))}
          </ul>
        )}

        {/* Mensaje sin resultados */}
        {searchClient && filteredClients.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">No se encontraron clientes</p>
        )}
      </div>

      {/* Tabla de documentos */}
      <HistoryTableDocument setShowModal/>

      {/* Modal reutilizable */}
      <HistoryModals
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nuevo Documento"
      >
        <p className="text-gray-600 mb-4">Rellena los datos del nuevo documento:</p>
        <div className="space-y-4"></div>
      </HistoryModals>
    </div>
  );
};