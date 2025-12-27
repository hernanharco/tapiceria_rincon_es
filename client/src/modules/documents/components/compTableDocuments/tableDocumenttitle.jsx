
import React from 'react'

export const tableDocumenttitle = (filteredProducts, handleChange, handleDeleteRow) => {
  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-sm px-4 md:px-6 py-2">
      {/* Tabla visible en escritorio */}
      <div className="w-full overflow-x-auto">
        <table className="hidden md:table w-full table-auto border-collapse mb-6">          
          <tbody>
            {filteredProducts.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300 hidden md:table-cell">
                  <input
                    type="text"
                    value={item.referencia || ""}
                    onChange={(e) =>
                      handleChange(idx, "referencia", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="px-2 py-1 text-sm text-gray-800 border border-gray-300">                  
                  <textarea
                    className="border border-gray-300 w-full resize-none overflow-hidden rounded p-2"
                    rows={3}
                    value={item.descripcion}
                    onKeyDown={(e) => {
                      if (e.key === "Enter"  && !e.shiftKey) {
                        
                      }
                    }}
                    onChange={(e) => {
                      handleChange(idx, "descripcion", e.target.value);
                      const textarea = e.target;
                      textarea.style.height = "auto";
                      textarea.style.height = `${textarea.scrollHeight}px`;
                    }}
                    style={{ minHeight: "60px" }}
                  />
                </td>
                <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300 hidden md:table-cell">
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    onChange={(e) =>
                      handleChange(idx, "cantidad", parseInt(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="whitespace-nowrap px-2 py-1 text-sm text-gray-800 text-center border border-gray-300">
                  <input
                    type="number"
                    step="0.01"
                    value={item.precio}
                    onChange={(e) =>
                      handleChange(idx, "precio", parseFloat(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300 hidden md:table-cell">
                  <input
                    type="number"
                    step="0.01"
                    value={item.dto}
                    onChange={(e) =>
                      handleChange(idx, "dto", parseFloat(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300 hidden md:table-cell">
                  <input
                    type="number"
                    step="0.01"
                    value={item.importe}
                    onChange={(e) =>
                      handleChange(idx, "importe", parseFloat(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="px-2 py-1 text-sm text-center border border-gray-300">
                  <button
                    onClick={() => handleDeleteRow(idx)}
                    className="text-red-500 hover:text-red-700 no-print"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan="7" className="text-center py-2">
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="text-blue-500 hover:text-blue-700 font-semibold"
                >
                  ➕ Agregar Producto
                </button>
              </td>
            </tr>
          </tbody> {/* Fin del tbody */}
        </table>

        {/* Tarjetas visibles en móvil */}
        <div className="space-y-4 md:hidden">
          {filteredProducts.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm flex flex-col justify-between"
            >
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  Producto #{idx + 1}
                </h3>
                <p>
                  <strong>Descripción:</strong>
                  <textarea
                    className="border border-gray-300 w-full resize-none overflow-hidden rounded p-2"
                    rows={3}
                    value={item.descripcion}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      handleChange(idx, "descripcion", e.target.value);
                      const textarea = e.target;
                      textarea.style.height = "auto";
                      textarea.style.height = `${textarea.scrollHeight}px`;
                    }}
                    style={{ minHeight: "60px" }}
                  />
                </p>
                <p>
                  <strong>Precio:</strong>{" "}
                  <input
                    className="border border-gray-300 w-full"
                    type="number"
                    step="0.01"
                    value={item.precio}
                    onChange={(e) =>
                      handleChange(idx, "precio", parseFloat(e.target.value))
                    }
                  />
                </p>
                <p>
                  <strong>Cantidad:</strong>{" "}
                  <input
                    className="border border-gray-300 w-full"
                    type="number"
                    value={item.cantidad}
                    onChange={(e) =>
                      handleChange(idx, "cantidad", parseInt(e.target.value))
                    }
                  />
                </p>
                <p>
                  <strong>Dto:</strong>{" "}
                  <input
                    className="border border-gray-300 w-full"
                    type="number"
                    value={item.dto}
                    onChange={(e) =>
                      handleChange(idx, "dto", parseFloat(e.target.value))
                    }
                  />
                </p>
                <p>
                  <strong>Importe:</strong>{" "}
                  <input
                    className="border border-gray-300 w-full"
                    type="number"
                    value={item.importe}
                    onChange={(e) =>
                      handleChange(idx, "importe", parseFloat(e.target.value))
                    }
                  />
                </p>
              </div>
              <button
                onClick={() => handleDeleteRow(idx)}
                className="text-red-500 hover:text-red-700 no-print mt-2 block mx-auto"
              >
                🗑️ Eliminar
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddRow}
            className="text-blue-500 hover:text-blue-700 font-semibold block mx-auto mt-4"
          >
            ➕ Agregar Producto
          </button>
        </div>
      </div> {/*Donde Finaliza el escritorio*/}
    </div>
  );
}
