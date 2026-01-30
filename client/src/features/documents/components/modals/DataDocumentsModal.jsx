import React, { useState, useEffect } from 'react';

export default function ProductModal({ isOpen, onClose, onSubmit, product = null, documento}) {
  const [formData, setFormData] = useState({
    referencia: '',
    descripcion: '',
    cantidad: 1,
    precio: 0,
    dto: 0,    
  });

  // Si hay un producto, lo cargamos al estado inicial
  useEffect(() => {
    if (product) {
      setFormData(product);
    } else {
      setFormData({
        referencia: '',
        descripcion: '',
        cantidad: 1,
        precio: 0,
        dto: 0,
        importe: 0,        
      });
    }
  }, [product]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const importe = formData.cantidad * formData.precio * (1 - formData.dto / 100);  
    
    onSubmit({
      ...formData,
      importe: importe.toFixed(2),
      documento
    });
  };

  const isEditing = !!product;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md relative">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          {isEditing ? 'Editar Producto' : 'Agregar Nuevo Producto'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Referencia */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Referencia</label>
            <input
              type="text"
              name="referencia"
              value={formData.referencia}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"              
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Cantidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Cantidad</label>
              <input
                type="number"
                name="cantidad"
                min="1"
                value={formData.cantidad}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Precio */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Precio</label>
              <input
                type="number"
                step="0.01"
                name="precio"
                value={formData.precio}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Descuento */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Descuento (%)</label>
            <input
              type="number"
              step="0.01"
              name="dto"
              value={formData.dto}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                isEditing 
                  ? 'bg-yellow-500 hover:bg-yellow-600 text-white' 
                  : 'bg-green-600 hover:bg-green-700 text-white'
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