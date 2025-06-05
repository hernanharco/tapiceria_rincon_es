import { useState, useMemo } from 'react';
import { HistoryTableDocument } from './HistoryTableDocument';
import { HistoryModals } from './HistoryModals';
import { useClients } from '../../hooks/useClients';

export const HistoryTable = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false); // Para mostrar el dropdown
  const [filteredClients, setFilteredClients] = useState([]); // Guarda los resultados del backend
  
  const { fetchClientsFromBackend } = useClients(); // Traemos la función del contexto

   // Simulando una lista de documentos
  const documents = [
    { id: 1, name: 'Contrato 2024', date: '2024-09-01' },
    { id: 2, name: 'Informe mensual', date: '2024-08-25' },
    { id: 3, name: 'Recibo de pago', date: '2024-08-20' },
    { id: 4, name: 'Acuerdo de confidencialidad', date: '2024-07-15' },
  ];

  // Filtro por nombre usando el término de búsqueda
  const filteredDocuments = useMemo(() => {
    if (!searchTerm.trim()) return documents;

    const lowerCaseTerm = searchTerm.toLowerCase();
    return documents.filter(doc =>
      doc.name.toLowerCase().includes(lowerCaseTerm)
    );
  }, [documents, searchTerm]);

  // Es una expresión condicional (ternaria) que decide si mostrar sugerencias o no, basándose en si el usuario ha escrito algo en el buscador.
  const suggestions = searchTerm.trim() ? filteredDocuments.slice(0, 5) : [];

  return (
    <div className="space-y-6">

      {/* Barra de búsqueda */}
      <div>
        <input
          type="text"
          placeholder="Buscar documento..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)} // Mostrar sugerencias al enfocar
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Cerrar con retraso
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Dropdown de sugerencias */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((doc) => (
              <li
                key={doc.id}
                onClick={() => {
                  setSearchTerm(doc.name); // Poner el nombre completo en el input
                  setShowSuggestions(false); // Ocultar el dropdown
                }}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                {doc.name} <span className="text-gray-500">({doc.date})</span>
              </li>
            ))}
          </ul>
        )}

        {/* Mensaje si no hay coincidencias */}
        {showSuggestions && suggestions.length === 0 && searchTerm.trim() && (
          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg p-2 text-gray-500 text-sm">
            No se encontraron coincidencias
          </div>
        )}
      </div>

      

      {/* Tabla de documentos - Componente externo */}
      <HistoryTableDocument setShowModal={setShowModal} />

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