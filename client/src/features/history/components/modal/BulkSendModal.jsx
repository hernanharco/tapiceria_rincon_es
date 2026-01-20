import React, { useState } from 'react';
import { FaWhatsapp, FaEnvelope, FaFilePdf, FaTimes, FaShareAlt } from 'react-icons/fa';

export const BulkSendModal = ({ isOpen, onClose, selectedCount, onConfirm, actionType }) => {
  const [options, setOptions] = useState({
    sendPre: true,
    sendAlb: false,
    sendFac: false,
  });

  if (!isOpen) return null;

  const isWhatsApp = actionType === 'whatsapp';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className={`px-6 py-4 flex justify-between items-center ${isWhatsApp ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
          <div className="flex items-center gap-3">
            {isWhatsApp ? <FaWhatsapp size={24} /> : <FaEnvelope size={24} />}
            <h3 className="font-bold text-lg">Enviar {selectedCount} documentos</h3>
          </div>
          <button onClick={onClose} className="hover:bg-black/10 p-1 rounded-full"><FaTimes size={20} /></button>
        </div>

        <div className="p-6 space-y-6 text-left">
          <p className="text-gray-600 text-sm italic">
            Selecciona los tipos de archivos que deseas enviar por <strong>{actionType.toUpperCase()}</strong>:
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { id: 'sendPre', label: 'Presupuestos (PRE)', icon: 'text-blue-600' },
              { id: 'sendAlb', label: 'Albaranes (ALB)', icon: 'text-green-600' },
              { id: 'sendFac', label: 'Facturas (FAC)', icon: 'text-red-600' },
            ].map((opt) => (
              <label key={opt.id} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${options[opt.id] ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-gray-50'}`}>
                <div className="flex items-center gap-3"><FaFilePdf className={opt.icon} size={20} /><span className="font-bold text-gray-700">{opt.label}</span></div>
                <input type="checkbox" checked={options[opt.id]} onChange={() => setOptions({ ...options, [opt.id]: !options[opt.id] })} className="w-5 h-5 rounded text-blue-600" />
              </label>
            ))}
          </div>
        </div>

        <div className="p-6 bg-gray-50 flex gap-3">
          <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200">Cancelar</button>
          <button 
            onClick={() => onConfirm(options)} 
            disabled={!options.sendPre && !options.sendAlb && !options.sendFac}
            className={`flex-[2] px-4 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${isWhatsApp ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50`}
          >
            <FaShareAlt /> Confirmar y Enviar
          </button>
        </div>
      </div>
    </div>
  );
};