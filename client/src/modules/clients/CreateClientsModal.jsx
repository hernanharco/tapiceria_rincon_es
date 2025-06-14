import React, { useState, useEffect } from 'react';

export const CreateClientsModal = ({ isOpen, onClose, onSubmit, client = null, company}) => {
  const [formData, setFormData] = useState({
    cif: '',
    name: '',
    address: '',
    zip_code: '',
    city: '',
    number: '',
  });

  // Detecta si estamos editando
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
    });
    onClose(); // Cierra modal
  };

  return (
    <div className="fixed inset-0 bg-gray bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-black p-6 rounded-lg shadow-xl w-full max-w-md mx-4">
        <h3 className="text-xl font-bold mb-4 text-white">
          {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* CIF */}
          <div>
            <label className="block text-sm font-medium text-white">CIF</label>
            <input
              type="text"
              name="cif"
              value={formData.cif || ''}
              onChange={handleChange}
              placeholder="Ej: B12345678"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!isEditing}
            />
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-white">Nombre</label>
            <input
              type="text"
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              placeholder="Nombre o razón social"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-white">Dirección</label>
            <input
              type="text"
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
              placeholder="Calle, número"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Código postal */}
          <div>
            <label className="block text-sm font-medium text-white">Código Postal</label>
            <input
              type="text"
              name="zip_code"
              value={formData.zip_code || ''}
              onChange={handleChange}
              placeholder="Ej: 28001"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Ciudad */}
          <div>
            <label className="block text-sm font-medium text-white">Ciudad</label>
            <input
              type="text"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              placeholder="Ej: Madrid"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-white">Teléfono</label>
            <input
              type="tel"
              name="number"
              value={formData.number || ''}
              onChange={handleChange}
              placeholder="Ej: 910 123 456"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={() => {
                onClose(); // Cierra el modal
              }}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white ${
                isEditing ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isEditing ? 'Actualizar' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};