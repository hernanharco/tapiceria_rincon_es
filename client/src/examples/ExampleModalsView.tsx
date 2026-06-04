

import React, { useState } from 'react';
import { Modal } from '../components/Modal';

export const HistoryDocumentsView = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Cliente</h2>

      <button
        onClick={() => setShowModal(true)}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        ➕ Agregar Documento
      </button>

      {/* Modal reutilizable */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nuevo Documento"
      >
        <p className="text-gray-600">Este es el contenido del modal.</p>
        <input
          type="text"
          placeholder="Nº Factura"
          className="mt-2 block w-full rounded border border-gray-300 p-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </Modal>
    </div>
  );
};