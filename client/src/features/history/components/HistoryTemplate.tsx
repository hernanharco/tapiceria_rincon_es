// @ts-nocheck
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { HistoryModals } from '../../clients/components/modals/DocumentCreateModal';
import { HistoryModalLogic } from '@/features/history/hooks/HistoryModalLogic';

import useClients from '../../../hooks/clients/useClients';
import { usePersistedState } from '../../../utils/usePersistedState';
import useTitleTableDocuments from '../../documents/hooks/useTitleTableDocuments';

import { HistoryTableDocumentLogic } from '../hooks/table/HistoryTableDocumentLogic';

export const HistoryTemplate = () => {
  /* =========================
     Estados locales del componente
     ========================= */

  // Controla la apertura/cierre del modal
  const [showModal, setShowModal] = useState(false);

  // Texto del buscador (persistido en localStorage)
  const [searchTerm, setSearchTerm] = usePersistedState(
    'historySearchTerm',
    '',
  );

  // Controla si el dropdown de sugerencias está visible
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Índice de la sugerencia activa (para navegación con teclado)
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  /* =========================
     Datos desde hooks
     ========================= */

  // Lista de clientes
  const { clients } = useClients();

  // Documentos + función para forzar recarga
  const { documents, refetch } = useTitleTableDocuments();

  /* =========================
     Referencias al DOM
     ========================= */

  // Referencia al input de búsqueda (para focus con F8)
  const inputRef = useRef(null);

  // Referencia al contenedor del dropdown
  const dropdownRef = useRef(null);

  /* =========================
     Sugerencias del buscador
     ========================= */

  // Calcula las sugerencias en base al texto buscado
  const suggestions = useMemo(() => {
    // Si el dropdown no está visible, no calculamos nada
    if (!showSuggestions) return [];

    const term = searchTerm.trim().toLowerCase();

    // Si no hay texto, mostramos los primeros 10 clientes
    if (!term) {
      return clients.slice(0, 10);
    }

    // Filtramos clientes por nombre o CIF
    const clientsMatchingDirectly = clients.filter(
      (client) =>
        client.name.toLowerCase().includes(term) ||
        client.cif.toLowerCase().includes(term),
    );

    // Limitamos a 5 resultados
    return clientsMatchingDirectly.slice(0, 5);
  }, [clients, searchTerm, showSuggestions]);

  /* =========================
     Manejo de teclado (dropdown)
     ========================= */

  // Permite navegar las sugerencias con ↑ ↓ Enter Esc
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showSuggestions || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveSuggestionIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev,
          );
          break;

        case 'ArrowUp':
          e.preventDefault();
          setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;

        case 'Enter':
          e.preventDefault();
          if (activeSuggestionIndex >= 0) {
            const selected = suggestions[activeSuggestionIndex];
            // Al seleccionar, guardamos ID + nombre
            setSearchTerm(`(#${selected.id}) ${selected.name}`);
            setShowSuggestions(false);
            setActiveSuggestionIndex(-1);
          }
          break;

        case 'Escape':
          // Cierra el dropdown
          setShowSuggestions(false);
          setActiveSuggestionIndex(-1);
          break;

        default:
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showSuggestions, suggestions, activeSuggestionIndex, setSearchTerm]);

  /* =========================
     Atajo de teclado global (F8)
     ========================= */

  // Al presionar F8 se enfoca el input de búsqueda
  useEffect(() => {
    const handleKeyDownGlobal = (e) => {
      if (e.keyCode === 119) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDownGlobal);
    return () => document.removeEventListener('keydown', handleKeyDownGlobal);
  }, []);

  /* =========================
     Carga defensiva de documentos
     ========================= */

  // Referencia para evitar bucle infinito: solo refetch una vez al montar
  const initialLoadDone = useRef(false);

  useEffect(() => {
    if (!initialLoadDone.current) {
      initialLoadDone.current = true;
      refetch();
    }
  }, [refetch]);

  /* =========================
     Filtrado de documentos por texto
     ========================= */

  // Filtra documentos cuando la búsqueda NO es cliente ni "todos"
  const filteredText = useMemo(() => {
    if (!searchTerm.trim()) return [];

    const term = searchTerm.trim().toLowerCase();
    console.log('filteredText: ', term);

    // Si es "todos" o es un cliente seleccionado, no filtramos aquí
    if (term === 'todos' || term.startsWith('(')) return [];

    // Filtrado por descripción
    return documents.filter(
      (doc) => doc.titdescripcion?.toLowerCase().includes(term) && doc.titledoc,
    );
  }, [searchTerm, documents]);

  /* =========================
     Render
     ========================= */

  return (
    <div className="space-y-0">
      {/* Buscador con sugerencias */}
      <div className="relative" ref={dropdownRef}>
        <label htmlFor="history-search" className="sr-only">Buscar cliente</label>
        <input
          id="history-search"
          type="text"
          placeholder="Buscar cliente... 'Todos' muestra todo"
          value={searchTerm}
          aria-label="Buscar cliente"
          aria-autocomplete="list"
          aria-controls="history-suggestions"
          aria-expanded={showSuggestions && suggestions.length > 0}
          aria-activedescendant={
            activeSuggestionIndex >= 0
              ? `suggestion-${suggestions[activeSuggestionIndex]?.id}`
              : undefined
          }
          role="combobox"
          // Selecciona al hacer doble clic (lo que pediste)
          onDoubleClick={(e) => (e.target as HTMLInputElement).select()}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={(e) => {
            setShowSuggestions(true);
            (e.target as HTMLInputElement).select(); // 💡 Mejora: selecciona todo al hacer clic simple para sobrescribir rápido
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500"
          ref={inputRef}
        />

        {/* Dropdown de sugerencias */}
        {showSuggestions && (
          <ul
            id="history-suggestions"
            role="listbox"
            aria-label="Sugerencias de clientes"
            className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg"
          >
            {suggestions.map((client, index) => (
              <li
                key={client.id}
                id={`suggestion-${client.id}`}
                role="option"
                aria-selected={activeSuggestionIndex === index}
                onClick={() => {
                  setSearchTerm(`(#${client.id}) ${client.name}`);
                  setShowSuggestions(false);
                }}
                className={`px-4 py-2 cursor-pointer text-sm ${
                  activeSuggestionIndex === index
                    ? 'bg-blue-100'
                    : 'hover:bg-gray-100'
                }`}
              >
                {client.name}{' '}
                <span className="text-gray-500">({client.cif})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal de creación / edición */}
      <HistoryModals
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Logo"
        searchTerm={searchTerm}
      />

      {/* Tabla de documentos filtrados */}
      <HistoryTableDocumentLogic
        setShowModal={setShowModal}
        documents={filteredText}
        searchTerm={searchTerm}
        allClients={clients}
      />
    </div>
  );
};
