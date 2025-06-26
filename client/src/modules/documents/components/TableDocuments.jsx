import { useEffect, useState } from "react";
import { formatCurrency } from "../../../utils/formatUtils";

export const TableDocuments = ({
  filteredProducts,
  setFilteredProducts,
  onProductsChange,
}) => {
  // Inicializar con una lista vacía si no hay productos
  useEffect(() => {
    if (!filteredProducts || filteredProducts.length === 0) {
      setFilteredProducts([]);
    }
  }, []);

  // Notificar al padre cada vez que haya cambios
  useEffect(() => {
    if (typeof onProductsChange === "function") {
      onProductsChange(filteredProducts);
    }
  }, [filteredProducts]);

  // Agregar nueva fila vacía
  const handleAddRow = () => {
    const newRow = {
      reference: "",
      description: "",
      quantity: 1,
      price: 0,
      dto: 0,
      amount: 0,
    };
    setFilteredProducts([...filteredProducts, newRow]);
  };

  // Actualizar un campo específico
  const handleChange = (index, field, value) => {
    const updatedList = [...filteredProducts];
    updatedList[index][field] = value;

    // Calcular 'amount' basado en otros campos
    if (
      field === "price" ||
      field === "quantity" ||
      field === "dto" ||
      field === "amount"
    ) {
      const price = parseFloat(updatedList[index].price) || 0;
      const quantity = parseInt(updatedList[index].quantity) || 0;
      const dto = parseFloat(updatedList[index].dto) || 0;
      const amount = parseFloat(updatedList[index].amount) || 0;

      if (field !== "amount") {
        const subtotal = price * quantity;
        const discount = subtotal * (dto / 100);
        updatedList[index].amount = subtotal - discount;
      } else if (field === "amount" && price > 0 && quantity > 0) {
        const calculatedDto = 100 - (amount / (price * quantity)) * 100;
        updatedList[index].dto = isNaN(calculatedDto)
          ? 0
          : calculatedDto.toFixed(2);
      }
    }

    setFilteredProducts(updatedList);
  };

  // Eliminar fila
  const handleDeleteRow = (index) => {
    const newList = filteredProducts.filter((_, i) => i !== index);
    setFilteredProducts(newList);
  };

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-sm px-4 md:px-6 py-2">
      {/* Tabla visible en escritorio */}
      <div className="w-full overflow-x-auto">
        <table className="hidden md:table w-full table-auto border-collapse mb-6">
          <thead>
            <tr className="bg-gray-100 text-gray-700 font-semibold">
              <th className="border border-gray-300 text-center hidden md:table-cell">
                Ref
              </th>
              <th className="border border-gray-300 text-center w-2/5">
                Descripción
              </th>
              <th className="border border-gray-300 text-center hidden md:table-cell">
                Cant
              </th>
              <th className="border border-gray-300 text-center">Precio</th>
              <th className="border border-gray-300 text-center hidden md:table-cell">
                Dto.
              </th>
              <th className="border border-gray-300 text-center hidden md:table-cell">
                Importe
              </th>
              <th className="border border-gray-300 text-center">Acci</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300 hidden md:table-cell">
                  <input
                    type="text"
                    value={item.reference}
                    onChange={(e) =>
                      handleChange(idx, "reference", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="px-2 py-1 text-sm text-gray-800 border border-gray-300">
                  <textarea
                    className="border border-gray-300 w-full resize-none overflow-hidden rounded p-2"
                    rows={3}
                    value={item.description}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      handleChange(idx, "description", e.target.value);
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
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(idx, "quantity", parseInt(e.target.value))
                    }
                    className="w-full border border-gray-300 rounded px-2 py-1"
                  />
                </td>
                <td className="whitespace-nowrap px-2 py-1 text-sm text-gray-800 text-center border border-gray-300">
                  <input
                    type="number"
                    step="0.01"
                    value={item.price}
                    onChange={(e) =>
                      handleChange(idx, "price", parseFloat(e.target.value))
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
                    value={item.amount}
                    onChange={(e) =>
                      handleChange(idx, "amount", parseFloat(e.target.value))
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
            {/* Botón para agregar nueva fila */}
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
          </tbody>
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
                    value={item.description}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      handleChange(idx, "description", e.target.value);
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
                    value={item.price}
                    onChange={(e) =>
                      handleChange(idx, "price", parseFloat(e.target.value))
                    }
                  />
                </p>
                <p>
                  <strong>Cantidad:</strong>{" "}
                  <input
                    className="border border-gray-300 w-full"
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleChange(idx, "quantity", parseInt(e.target.value))
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
                    value={item.amount}
                    onChange={(e) =>
                      handleChange(idx, "amount", parseFloat(e.target.value))
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
      </div>
    </div>
  );
};
