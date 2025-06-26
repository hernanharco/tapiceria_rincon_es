import { useState, useMemo, useRef, useEffect } from 'react';
import { HistoryTableDocument } from './HistoryTableDocument';
import { HistoryModals } from './HistoryModals';

import useKeys from '../documents/hooks/useKeys';
import useClients from '../clients/hooks/useClients'; // Importamos el hook de clientes

export const HistoryTemplate = () => {
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);  
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const { clients } = useClients(); // Traemos los clientes del contexto

  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filtro por nombre usando el término de búsqueda
  const filteredDocuments = useMemo(() => {
    if (!searchTerm.trim()) return clients;

    const lowerCaseTerm = searchTerm.toLowerCase();
    return clients.filter(doc =>
      doc.name.toLowerCase().includes(lowerCaseTerm)
    );
  }, [clients, searchTerm]);

  // Es una expresión condicional (ternaria) que decide si mostrar sugerencias o no, basándose en si el usuario ha escrito algo en el buscador.
  const suggestions = useMemo(() => {
    if (!showSuggestions) return [];

    // Si no hay término de búsqueda, mostramos todos los clientes
    if (!searchTerm.trim()) {
      return clients.length > 0 ? clients.slice(0, 5) : []
    }

    // Si hay término de búsqueda, filtramos como antes
    const lowerCaseTerm = searchTerm.toLowerCase();
    return clients.filter(client =>
      client.name.toLowerCase().includes(lowerCaseTerm) ||
      client.cif.toLowerCase().includes(lowerCaseTerm)
    ).slice(0, 5);
  }, [clients, searchTerm, showSuggestions]);

  // Manejo de teclas
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveSuggestionIndex(prev =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : -1));
          break;

        case 'Enter':
          e.preventDefault();
          if (activeSuggestionIndex >= 0) {
            const selected = suggestions[activeSuggestionIndex];
            setSearchTerm(`(${selected.cif}) ${selected.name}`); // ✅ Guardamos ambos campos
            setShowSuggestions(false);
            setActiveSuggestionIndex(-1);
          }
          break;

        case 'Escape':
          setShowSuggestions(false);
          setActiveSuggestionIndex(-1);
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);

  }, [showSuggestions, suggestions, activeSuggestionIndex]);

  // Con este efecto hacemos que cuando presionemos f8 no coloca en el buscado
  useEffect(() => {
    const handleKeyDownGlobal = (e) => {
      if (e.keyCode === 119) {
        e.preventDefault();
        inputRef.current?.focus(); // Enfoca el input de búsqueda
      }
    };

    document.addEventListener('keydown', handleKeyDownGlobal);
    return () => document.removeEventListener('keydown', handleKeyDownGlobal);
  }, []);

  useEffect(() => {
    if (!clients || clients.length === 0) return;

    if (searchTerm.trim()) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(true); // Mostrar siempre sugerencias si hay clientes
    }
  }, [searchTerm, clients]);

  //   useEffect(() => {
  //   setActiveSuggestionIndex(-1);
  // }, [searchTerm]);

  // Limpiar selección al cerrar el dropdown
  useEffect(() => {
    if (!showSuggestions) {
      setActiveSuggestionIndex(-1);
    }
  }, [showSuggestions]);

  return (
    <div className="space-y-6">
      {/* Barra de búsqueda */}
      <div className="relative" ref={dropdownRef}>
        <input
          type="text"
          placeholder="Buscar cliente..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ref={inputRef}
        />

        {/* Dropdown de sugerencias */}
        {showSuggestions && (
          <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((client, index) => (
              <li key={client.cif} onClick={() => {
                setSearchTerm(`(${client.cif}) ${client.name}`);
                setShowSuggestions(false);
              }} className={`px-4 py-2 cursor-pointer text-sm ${activeSuggestionIndex === index ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}>
                {client.name} <span className="text-gray-500">({client.cif})</span>
              </li>
            ))}            
          </ul>
        )}
      </div>

      {/* Modal reutilizable */}
      <HistoryModals
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Logo"
        searchTerm={searchTerm}
      >
        <p className="text-gray-600 mb-4">Rellena los datos del nuevo documento:</p>
        <div className="space-y-4"></div>

      </HistoryModals>

      {/* Tabla de documentos - Componente externo Dibuja la tabla segun la informacion buscada */}
      <HistoryTableDocument
        setShowModal={setShowModal}
        searchTerm={searchTerm}
        allClients={clients} // Pasamos todos los clientes al componente
      />      
    </div>
  );
};