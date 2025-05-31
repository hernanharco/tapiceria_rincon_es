import React, { useState } from 'react';
import ProductModal from './modals/DataDocumentsModal';  
import useDataDocuments from '../../hooks/useDataDocuments';
import useFooters from '../../hooks/useFooters';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

export const TableDocuments = ({ documentos }) => {
  const { datadocuments, addProduct, deleteProduct, updateProduct, refetchdatadocuments } = useDataDocuments();
  const { footers } = useFooters();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);  

  // Manejador de agregar/editar
  const handleSaveProduct = async (producto) => {
    try {
      if (producto.id) {        
        await updateProduct(producto.id, producto);
      } else {
        await addProduct(producto);
      }
      await refetchdatadocuments(); // Actualiza la tabla
      setShowModal(false);
      setEditingProduct(null);
    } catch (err) {
      alert(`Error al ${producto.id ? 'actualizar' : 'guardar'} el producto`);
    }
  };

  // Manejador de borrar
  const handleDeleteProduct = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      deleteProduct(id).catch(() => {
        alert("Hubo un error al eliminar");
      });
    }
  };

  const hasItems = Array.isArray(datadocuments) && datadocuments.length > 0;
  const hasFooter = footers && footers.length > 0;

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-sm p-4">
      {/* Botón Agregar */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-700">Productos</h2>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          ➕ Agregar Producto
        </button>
      </div>

      {/* Tabla de productos */}
      {hasItems ? (
        <table className="min-w-full border-collapse mb-6">
          <thead>
            <tr className="bg-gray-200 text-gray-700 font-semibold">
              <th className="px-4 py-2 text-sm text-center border border-gray-300 hidden md:table-cell print:table-cell">Referencia</th>
              <th className="px-4 py-2 text-sm text-center border-t border-b border-r border-gray-300">Descripción</th>
              <th className="px-4 py-2 text-sm text-center border-t border-b border-r border-gray-300 hidden md:table-cell print:table-cell">Cantidad</th>
              <th className="px-4 py-2 text-sm text-center border-t border-b border-r border-gray-300">Precio</th>
              <th className="px-4 py-2 text-sm text-center border-t border-b border-r border-gray-300 hidden md:table-cell print:table-cell">Dto.</th>
              <th className="px-4 py-2 text-sm text-center border border-gray-300">Importe</th>
              <th className="px-4 py-2 text-sm text-center border border-gray-300">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {datadocuments.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-2 text-sm text-gray-800 text-center border border-gray-300 hidden md:table-cell print:table-cell">
                  {item.referencia || '-'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-center border-t border-b border-r border-gray-300">
                  {item.descripcion || '-'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-center border-t border-b border-r border-gray-300 hidden md:table-cell print:table-cell">
                  {item.cantidad || 0}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-center border-t border-b border-r border-gray-300">
                  {item.precio ? formatCurrency(item.precio) : '€0.00'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-center border-t border-b border-r border-gray-300 hidden md:table-cell print:table-cell">
                  {item.dto ? `${item.dto}%` : '0%'}
                </td>
                <td className="px-4 py-2 text-sm text-gray-800 text-center border border-gray-300">
                  {item.importe ? formatCurrency(item.importe) : '€0.00'}
                </td>
                <td className="px-4 py-2 text-sm text-center border border-gray-300">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(item);
                      setShowModal(true);
                    }}
                    className="text-yellow-500 hover:text-yellow-700 mr-2"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProduct(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-500 text-center py-4">No hay productos disponibles</p>
      )}

      {/* Modal único para crear o editar */}
      {showModal && (
        <ProductModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSubmit={handleSaveProduct}
          product={editingProduct}
          documento={documentos[0].num_factura}
        />
      )}
    </div>
  );
};