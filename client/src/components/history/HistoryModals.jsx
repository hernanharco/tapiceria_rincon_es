import React from 'react';
import { TableDocuments } from '../document/TableDocuments';

export const HistoryModals = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      {/* Contenedor del modal con scroll */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[80vh] overflow-y-auto p-6 relative mx-4">
        {/* Título */}
        <h3 className="text-xl font-semibold text-gray-800 mb-4">{title}</h3>

        {/* Contenido dinámico */}
        <div className="mb-6">
          {children}
        </div>

        {/* Tabla u otros componentes */}
        <div className="mb-6">
          <TableDocuments />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Cancelar
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};