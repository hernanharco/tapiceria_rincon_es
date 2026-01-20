import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaEnvelope, FaFilePdf, FaTimes, FaShareAlt, FaUser, FaPhoneAlt, FaEdit } from 'react-icons/fa';

export const BulkSendModal = ({ isOpen, onClose, selectedCount, onConfirm, actionType, initialData }) => {
  // Estados para los datos editables del cliente
  const [clientInfo, setClientInfo] = useState({
    nombre: '',
    telefono: ''
  });
  
  const [options, setOptions] = useState({
    sendPre: true,
    sendAlb: false,
    sendFac: false,
  });

  // Efecto para cargar los datos cuando se abre el modal
  useEffect(() => {
    if (isOpen && initialData) {
      setClientInfo({
        nombre: initialData.nombre || 'Cliente',
        telefono: initialData.telefono || ''
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const isWhatsApp = actionType === 'whatsapp';

  // Manejador para enviar los datos finales (opciones + info cliente)
  const handleConfirm = () => {
    onConfirm({
      ...options,
      customName: clientInfo.nombre,
      customPhone: clientInfo.telefono
    });
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Cabecera */}
        <div className={`px-6 py-4 flex justify-between items-center ${isWhatsApp ? 'bg-green-600' : 'bg-blue-600'} text-white`}>
          <div className="flex items-center gap-3">
            {isWhatsApp ? <FaWhatsapp size={24} /> : <FaEnvelope size={24} />}
            <h3 className="font-bold text-lg">Enviar a {clientInfo.nombre}</h3>
          </div>
          <button onClick={onClose} className="hover:bg-black/10 p-1 rounded-full transition-colors">
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6 space-y-5 text-left max-h-[70vh] overflow-y-auto">
          
          {/* SECCIÓN: Edición de Datos de Contacto */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <FaEdit /> Datos de destino
            </h4>
            
            <div className="space-y-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">Nombre del Cliente</label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-3" />
                  <input 
                    type="text" 
                    value={clientInfo.nombre}
                    onChange={(e) => setClientInfo({...clientInfo, nombre: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Nombre del cliente"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">WhatsApp / Teléfono</label>
                <div className="relative">
                  <FaPhoneAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 size-3" />
                  <input 
                    type="text" 
                    value={clientInfo.telefono}
                    onChange={(e) => setClientInfo({...clientInfo, telefono: e.target.value})}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all font-mono"
                    placeholder="Ej: 634405549"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECCIÓN: Selección de Documentos */}
          <div className="space-y-3">
            <p className="text-gray-600 text-xs font-semibold uppercase tracking-wider ml-1">Archivos a incluir:</p>
            <div className="grid grid-cols-1 gap-2">
              {[
                { id: 'sendPre', label: 'Presupuestos (PRE)', icon: 'text-blue-600' },
                { id: 'sendAlb', label: 'Albaranes (ALB)', icon: 'text-green-600' },
                { id: 'sendFac', label: 'Facturas (FAC)', icon: 'text-red-600' },
              ].map((opt) => (
                <label 
                  key={opt.id} 
                  className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-all ${options[opt.id] ? 'border-blue-500 bg-blue-50/50' : 'border-gray-100 bg-gray-50 hover:border-gray-200'}`}
                >
                  <div className="flex items-center gap-3">
                    <FaFilePdf className={opt.icon} size={18} />
                    <span className="font-bold text-gray-700 text-sm">{opt.label}</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={options[opt.id]} 
                    onChange={() => setOptions({ ...options, [opt.id]: !options[opt.id] })} 
                    className="w-5 h-5 rounded text-blue-600 focus:ring-0 cursor-pointer" 
                  />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer con Botones */}
        <div className="p-4 bg-gray-100 flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 px-4 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-200 transition-colors text-sm"
          >
            Cancelar
          </button>
          <button 
            onClick={handleConfirm} 
            disabled={(!options.sendPre && !options.sendAlb && !options.sendFac) || !clientInfo.telefono}
            className={`flex-[2] px-4 py-3 rounded-xl font-bold text-white flex items-center justify-center gap-2 ${isWhatsApp ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} disabled:opacity-50 transition-all shadow-lg active:scale-95 text-sm`}
          >
            <FaShareAlt /> {isWhatsApp ? 'Abrir WhatsApp' : 'Preparar Envío'}
          </button>
        </div>
      </div>
    </div>
  );
};