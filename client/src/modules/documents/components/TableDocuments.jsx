
import { useState, useEffect } from 'react';

 
import { DocumentsFooter } from './DocumentsFooter';
import ProductModal from './modals/DataDocumentsModal';
import useDataDocuments from '../hooks/useDataDocuments';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR'
  }).format(value);
};

export const TableDocuments = ({
  numDocument,
  search = () => { },
}) => {

  // console.log("TableDocuments. numDocument:", numDocument);

  const { datadocuments, addProduct, updateProduct, deleteProduct, refetchdatadocuments, getDocumentsByNum } = useDataDocuments();
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Manejador de guardar/editar producto
  const handleSaveProduct = async (producto) => {
    // console.log("handleSaveProduct in HistoryTableDocument", producto)
    try {
      if (producto.id) {
        await updateProduct(producto.id, producto);
      } else {
        await addProduct(producto);
      }
      await refetchdatadocuments(); // Recargar datos
      setShowModal(false);
      setEditingProduct(null);
    } catch (err) {
      alert(`Error al ${producto.id ? 'actualizar' : 'guardar'} el producto`);
    }
  };

  // Manejador de eliminar
  const handleDeleteProduct = (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      deleteProduct(id).catch(() => {
        alert("Hubo un error al eliminar");
      });
    }
  };

  const hasItems = Array.isArray(filteredProducts) && filteredProducts.length > 0;

  // Filtrar productos cada vez que cambie numDocument
  useEffect(() => {
    // console.log("Numero de Documento en TableDocuments", numDocument);
    if (!numDocument) {
      setFilteredProducts([]);
      return;
    }

    if (numDocument && !isNaN(Number(numDocument))) {
      const index = parseInt(numDocument, 10);
      const results = getDocumentsByNum(index); // Asegúrate que esta función exista y funcione bien
      // console.log("resultado de busqueda por filtro", results);
      setFilteredProducts(results || []);
    } else {
      setFilteredProducts([]);
    }
  }, [numDocument, datadocuments]);

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-sm px-4 md:px-6 py-2">
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

      {/* Contenedor de tabla o tarjetas */}
      <div className="w-full overflow-x-auto">
        {hasItems ? (
          <>
            {/* Tabla - Solo visible en escritorio */}
            <table className="hidden md:table w-full table-auto border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100 text-gray-700 font-semibold">
                  <th className="border border-gray-300 text-center hidden md:table-cell ">Ref</th>
                  <th className="border border-gray-300 text-center">Descripción</th>
                  <th className="border border-gray-300 text-center  hidden md:table-cell ">Cant</th>
                  <th className="border border-gray-300 text-center ">Precio</th>
                  <th className="border border-gray-300 text-center hidden md:table-cell ">Dto.</th>
                  <th className="border border-gray-300 text-center">Importe</th>
                  <th className="border border-gray-300 text-center">Acci</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors duration-150 ">
                    <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300 hidden md:table-cell ">
                      {item.referencia || '-'}
                    </td>
                    <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300">
                      {item.descripcion || '-'}
                    </td>
                    <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300 hidden md:table-cell ">
                      {item.cantidad || 0}
                    </td>
                    <td className="whitespace-nowrap px-2 py-1 text-sm text-gray-800 text-center border border-gray-300">
                      {item.precio ? formatCurrency(item.precio) : '€0.00'}
                    </td>
                    <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300 hidden md:table-cell ">
                      {item.dto ? `${item.dto}%` : '0%'}
                    </td>
                    <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300">
                      {item.importe ? formatCurrency(item.importe) : '€0.00'}
                    </td>
                    <td className="px-2 py-1 text-sm text-center border border-gray-300">
                      <div className="flex justify-center space-x-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingProduct(item);
                            setShowModal(true);
                          }}
                          className="text-yellow-500 hover:text-yellow-700 no-print"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(item.id)}
                          className="text-red-500 hover:text-red-700 no-print"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Tarjetas - Solo visibles en móvil */}
            <div className="space-y-4 md:hidden">
              {filteredProducts.map((item, idx) => (
                <div key={idx} className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm">
                  <h3 className="font-semibold text-gray-700 mb-2">Producto #{idx + 1}</h3>
                  <p><strong>Descripción:</strong> {item.descripcion || '-'}</p>
                  <p><strong>Precio:</strong> {item.precio ? formatCurrency(item.precio) : '€0.00'}</p>
                  <p><strong>Cantidad:</strong> {item.cantidad || 0}</p>
                  <p><strong>Importe:</strong> {item.importe ? formatCurrency(item.importe) : '€0.00'}</p>

                  <div className="mt-3 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(item);
                        setShowModal(true);
                      }}
                      className="text-yellow-500 hover:text-yellow-700 no-print"
                    >
                      ✏️
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteProduct(item.id)}
                      className="text-red-500 hover:text-red-700 no-print"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pie de documento fuera de la tabla */}
            <div className="mt-6">
              <DocumentsFooter 
                numDocument={numDocument}
                filteredProducts={filteredProducts}  
              />
            </div>
          </>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay productos disponibles</p>
        )}
      </div>

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
          documento={numDocument}
        />
      )}
    </div>
  );
};