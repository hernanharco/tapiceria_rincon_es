import React, { useState, useEffect } from 'react';
// Iconos para mejorar la UX
import { FaIdCard, FaUser, FaMapMarkerAlt, FaEnvelope, FaCity, FaMapMarkedAlt, FaPhone } from 'react-icons/fa';

export const CreateClientsModal = ({ isOpen, onClose, onSubmit, client = null, company }) => {
  const [formData, setFormData] = useState({
    cif: '',
    name: '',
    address: '',
    zip_code: '',
    city: '',
    province: '',
    number: '',
  });

  // Detecta si estamos editando
  // console.log('CreateClientsModal - client:', client);
  const isEditing = !!client;

  // Reiniciar formData cuando cambia client o se abre/cierra el modal
  useEffect(() => {
    if (isEditing && client) {
      // Si hay cliente, carga sus datos
      setFormData(client);
    } else {
      // Si es nuevo, reiniciar todos los campos
      setFormData({
        cif: '',         // 👈 Vacío, sin placeholder
        name: '',
        address: '',
        zip_code: '',
        city: '',
        province: '',
        number: '',
      });
    }
  }, [client, isEditing, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {        
    e.preventDefault();    
    onSubmit({
      ...formData,
      company: company, // Asegúrate de pasar el ID de la empresa
      isEditing: isEditing, // Indica si es nuevo o edición
    });
    onClose(); // Cierra modal
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-lg mx-4 sm:p-6 sm:max-w-xl lg:max-w-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Título */}
        <h3 className="text-2xl font-bold text-gray-800 mb-6">
          {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h3>

        {/* Contenido con scroll */}
        <div className="overflow-y-auto pr-2 flex-1">
          <form id="client-form" onSubmit={handleSubmit} className="space-y-5">
            {/* CIF */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaIdCard className="text-blue-500" />
                CIF
              </label>
              <input
                type="text"
                name="cif"
                value={formData.cif || ''}
                onChange={handleChange}
                placeholder="Ej: B12345678"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required={!isEditing}
              />
            </div>

            {/* Nombre */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaUser className="text-blue-500" />
                Nombre o Razón Social
              </label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Nombre completo o razón social"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaMapMarkerAlt className="text-blue-500" />
                Dirección
              </label>
              <input
                type="text"
                name="address"
                value={formData.address || ''}
                onChange={handleChange}
                placeholder="Calle, número, piso..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Código postal, Ciudad y Provincia en una fila (en pantallas grandes) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaEnvelope className="text-blue-500" />
                  Cód. Postal
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code || ''}
                  onChange={handleChange}
                  placeholder="28001"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaCity className="text-blue-500" />
                  Ciudad
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                  placeholder="Madrid"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <FaMapMarkedAlt className="text-blue-500" />
                  Provincia
                </label>
                <input
                  type="text"
                  name="province"
                  value={formData.province || ''}
                  onChange={handleChange}
                  placeholder="Asturias"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Teléfono */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <FaPhone className="text-blue-500" />
                Teléfono
              </label>
              <input
                type="tel"
                name="number"
                value={formData.number || ''}
                onChange={handleChange}
                placeholder="910 123 456"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Botones */}
        <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200 font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            form="client-form"
            className={`px-5 py-2.5 text-white rounded-lg font-medium transition-colors duration-200 ${
              isEditing 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isEditing ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};