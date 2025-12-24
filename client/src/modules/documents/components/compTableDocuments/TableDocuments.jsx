import { useEffect, useState } from "react";
import { formatCurrency } from "../../../../utils/formatUtils";

export const TableDocuments = ({
  filteredProducts,
  setFilteredProducts,
  onProductsChange,
  onDeleteRow,
}) => {
  // console.log("filteredProducts", filteredProducts);
  // Notificar al padre cada vez que haya cambios
  useEffect(() => {
    if (typeof onProductsChange === "function") {
      onProductsChange(filteredProducts);
    }
  }, [filteredProducts]);

  // Agregar tres nuevas filas
  const handleAddRow = () => {
    const rowObservaciones = {
      referencia: "",
      descripcion: "",
      cantidad: "",
      precio: "",
      dto: "",
      importe: "",
    };

    const rowMateriales = {
      referencia: "",
      descripcion: "Materiales",
      cantidad: 1,
      precio: 0,
      dto: 0,
      importe: 0,
    };

    const rowManoObra = {
      referencia: "",
      descripcion: "Mano de Obra",
      cantidad: 1,
      precio: 0,
      dto: 0,
      importe: 0,
    };

    setFilteredProducts([
      ...filteredProducts,
      rowObservaciones,
      rowMateriales,
      rowManoObra,
    ]);
  };

  // Actualizar un campo específico
  const handleChange = (index, field, value) => {
    const updatedList = [...filteredProducts];
    updatedList[index][field] = value;

    // Calcular 'importe' basado en otros campos
    if (
      field === "precio" ||
      field === "cantidad" ||
      field === "dto" ||
      field === "importe"
    ) {
      const precio = parseFloat(updatedList[index].precio) || 0;
      const cantidad = parseInt(updatedList[index].cantidad) || 0;
      const dto = parseFloat(updatedList[index].dto) || 0;

      if (field !== "importe") {
        const subtotal = precio * cantidad;
        const discount = subtotal * (dto / 100);
        updatedList[index].importe = subtotal - discount;
      } else if (field === "importe" && precio > 0 && cantidad > 0) {
        const calculatedDto = 100 - (value / (precio * cantidad)) * 100;
        updatedList[index].dto = isNaN(calculatedDto)
          ? 0
          : calculatedDto.toFixed(2);
      }
    }

    setFilteredProducts(updatedList);
  };

  // Eliminar fila
  const handleDeleteRow = (index) => {
    const newFilteredProducts = [...filteredProducts];

    // // Encontrar el índice inicial del grupo de 3
    // let startIndex = index;

    // // Retroceder hasta encontrar el inicio del grupo (múltiplo de 3)
    // while (startIndex > 0 && startIndex % 3 !== 0) {
    //   startIndex--;
    // }

    // // Eliminar 3 filas desde el inicio del grupo
    // newFilteredProducts.splice(startIndex, 3);

    // setFilteredProducts(newFilteredProducts);

    onDeleteRow(newFilteredProducts, index)
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
                    value={item.referencia}
                    readOnly={
                      item.descripcion !== "Mano de Obra" &&
                      item.descripcion !== "Materiales"
                    }
                    onChange={(e) =>
                      handleChange(idx, "referencia", e.target.value)
                    }
                    className={`w-full ${
                      item.descripcion === "Mano de Obra" ||
                      item.descripcion === "Materiales"
                        ? "border border-gray-300 rounded px-2 py-1"
                        : ""
                    }`}
                  />
                </td>
                {/* esta en la parte para el textarea */}
                <td className="text-sm text-gray-800 border border-gray-300">
                  <textarea
                    className={`border border-gray-300 w-full resize-none overflow-hidden rounded p-2 ${
                      item.descripcion === "Mano de Obra" ||
                      item.descripcion === "Materiales"
                        ? "bg-gray-100 text-center"
                        : ""
                    }`}
                    rows={
                      item.descripcion === "Mano de Obra" ||
                      item.descripcion === "Materiales"
                        ? 1
                        : 3
                    }
                    value={item.descripcion}
                    readOnly={
                      item.descripcion === "Mano de Obra" ||
                      item.descripcion === "Materiales"
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        //e.preventDefault();
                      }
                    }}
                    onChange={(e) => {
                      handleChange(idx, "descripcion", e.target.value);
                      const textarea = e.target;
                      if (
                        item.descripcion !== "Mano de Obra" &&
                        item.descripcion !== "Materiales"
                      ) {
                        textarea.style.height = "auto";
                        textarea.style.height = `${textarea.scrollHeight}px`;
                      }
                    }}
                    style={{
                      minHeight:
                        item.descripcion === "Mano de Obra" ||
                        item.descripcion === "Materiales"
                          ? "auto"
                          : "60px",
                      maxHeight:
                        item.descripcion === "Mano de Obra" ||
                        item.descripcion === "Materiales"
                          ? "none"
                          : "120px",
                    }}
                  />
                  {/* finaliza el textarea */}
                </td>
                <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300 hidden md:table-cell">
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    readOnly={
                      item.descripcion !== "Mano de Obra" &&
                      item.descripcion !== "Materiales"
                    }
                    onChange={(e) =>
                      handleChange(idx, "cantidad", parseInt(e.target.value))
                    }
                    className={`w-full  ${
                      item.descripcion === "Mano de Obra" ||
                      item.descripcion === "Materiales"
                        ? "border border-gray-300 rounded px-2 py-1"
                        : ""
                    }`}
                  />
                </td>
                <td className="whitespace-nowrap px-2 py-1 text-sm text-gray-800 text-center border border-gray-300">
                  <input
                    type="number"
                    step="0.01"
                    value={item.precio}
                    readOnly={
                      item.descripcion !== "Mano de Obra" &&
                      item.descripcion !== "Materiales"
                    }
                    onChange={(e) =>
                      handleChange(idx, "precio", parseFloat(e.target.value))
                    }
                    className={`w-full  ${
                      item.descripcion === "Mano de Obra" ||
                      item.descripcion === "Materiales"
                        ? "border border-gray-300 rounded px-2 py-1"
                        : ""
                    }`}
                  />
                </td>
                <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300 hidden md:table-cell">
                  <input
                    type="number"
                    step="0.01"
                    value={item.dto}
                    readOnly={
                      item.descripcion !== "Mano de Obra" &&
                      item.descripcion !== "Materiales"
                    }
                    onChange={(e) =>
                      handleChange(idx, "dto", parseFloat(e.target.value))
                    }
                    className={`w-full  ${
                      item.descripcion === "Mano de Obra" ||
                      item.descripcion === "Materiales"
                        ? "border border-gray-300 rounded px-2 py-1"
                        : ""
                    }`}
                  />
                </td>
                <td className="px-2 py-1 text-sm text-gray-800 text-center border border-gray-300 hidden md:table-cell">
                  <input
                    type="number"
                    step="0.01"
                    value={item.importe}
                    readOnly={
                      item.descripcion !== "Mano de Obra" &&
                      item.descripcion !== "Materiales"
                    }
                    onChange={(e) =>
                      handleChange(idx, "importe", parseFloat(e.target.value))
                    }
                    className={`w-full  ${
                      item.descripcion === "Mano de Obra" ||
                      item.descripcion === "Materiales"
                        ? "border border-gray-300 rounded px-2 py-1"
                        : ""
                    }`}
                  />
                </td>
                <td className="px-2 py-1 text-sm text-center border border-gray-300">
                  <button
                    onClick={() => handleDeleteRow(idx)}
                    className="text-red-500 hover:text-red-700 no-print"
                  >
                    {item.descripcion === "Mano de Obra" ? "🗑️" : null}
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
          </tbody>
          {/* Fin del tbody */}
        </table>

        {/* Tarjetas visibles en móvil */}
        <div className="space-y-4 md:hidden">
          {filteredProducts.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-sm"
            >
              <h3 className="font-semibold text-gray-700 mb-3">
                Producto #{idx + 1}
              </h3>

              {/* Campo Referencia */}
              <div className="mb-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Referencia
                </label>
                <input
                  type="text"
                  value={item.referencia}
                  readOnly={
                    item.descripcion !== "Mano de Obra" &&
                    item.descripcion !== "Materiales"
                  }
                  onChange={(e) =>
                    handleChange(idx, "referencia", e.target.value)
                  }
                  className={`w-full border border-gray-300 rounded px-2 py-1 ${
                    item.descripcion === "Mano de Obra" ||
                    item.descripcion === "Materiales"
                      ? ""
                      : "bg-gray-100"
                  }`}
                />
              </div>

              {/* Campo Descripción */}
              <div className="mb-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Descripción
                </label>
                <textarea
                  className={`border border-gray-300 w-full resize-none overflow-hidden rounded p-2 ${
                    item.descripcion === "Mano de Obra" ||
                    item.descripcion === "Materiales"
                      ? "bg-gray-100 text-center"
                      : ""
                  }`}
                  rows={
                    item.descripcion === "Mano de Obra" ||
                    item.descripcion === "Materiales"
                      ? 1
                      : 3
                  }
                  value={item.descripcion}
                  readOnly={
                    item.descripcion === "Mano de Obra" ||
                    item.descripcion === "Materiales"
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                    }
                  }}
                  onChange={(e) => {
                    handleChange(idx, "descripcion", e.target.value);
                    const textarea = e.target;
                    if (
                      item.descripcion !== "Mano de Obra" &&
                      item.descripcion !== "Materiales"
                    ) {
                      textarea.style.height = "auto";
                      textarea.style.height = `${textarea.scrollHeight}px`;
                    }
                  }}
                  style={{
                    minHeight:
                      item.descripcion === "Mano de Obra" ||
                      item.descripcion === "Materiales"
                        ? "auto"
                        : "60px",
                    maxHeight:
                      item.descripcion === "Mano de Obra" ||
                      item.descripcion === "Materiales"
                        ? "none"
                        : "120px",
                  }}
                />
              </div>

              {/* Precio */}
              <div className="mb-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.precio}
                  readOnly={
                    item.descripcion !== "Mano de Obra" &&
                    item.descripcion !== "Materiales"
                  }
                  onChange={(e) =>
                    handleChange(idx, "precio", parseFloat(e.target.value))
                  }
                  className={`w-full border border-gray-300 rounded px-2 py-1 ${
                    item.descripcion === "Mano de Obra" ||
                    item.descripcion === "Materiales"
                      ? ""
                      : "bg-gray-100"
                  }`}
                />
              </div>

              {/* Cantidad */}
              <div className="mb-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.cantidad}
                  readOnly={
                    item.descripcion !== "Mano de Obra" &&
                    item.descripcion !== "Materiales"
                  }
                  onChange={(e) =>
                    handleChange(idx, "cantidad", parseInt(e.target.value))
                  }
                  className={`w-full border border-gray-300 rounded px-2 py-1 ${
                    item.descripcion === "Mano de Obra" ||
                    item.descripcion === "Materiales"
                      ? ""
                      : "bg-gray-100"
                  }`}
                />
              </div>

              {/* Dto */}
              <div className="mb-2">
                <label className="block text-xs text-gray-600 mb-1">
                  Dto (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.dto}
                  readOnly={
                    item.descripcion !== "Mano de Obra" &&
                    item.descripcion !== "Materiales"
                  }
                  onChange={(e) =>
                    handleChange(idx, "dto", parseFloat(e.target.value))
                  }
                  className={`w-full border border-gray-300 rounded px-2 py-1 ${
                    item.descripcion === "Mano de Obra" ||
                    item.descripcion === "Materiales"
                      ? ""
                      : "bg-gray-100"
                  }`}
                />
              </div>

              {/* Importe */}
              <div className="mb-3">
                <label className="block text-xs text-gray-600 mb-1">
                  Importe
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.importe}
                  readOnly={
                    item.descripcion !== "Mano de Obra" &&
                    item.descripcion !== "Materiales"
                  }
                  onChange={(e) =>
                    handleChange(idx, "importe", parseFloat(e.target.value))
                  }
                  className={`w-full border border-gray-300 rounded px-2 py-1 ${
                    item.descripcion === "Mano de Obra" ||
                    item.descripcion === "Materiales"
                      ? ""
                      : "bg-gray-100"
                  }`}
                />
              </div>

              {/* Botón eliminar */}
              <button
                onClick={() => handleDeleteRow(idx)}
                className="text-red-500 hover:text-red-700 no-print mt-2 block mx-auto text-sm"
              >
                {item.descripcion === "Mano de Obra" ? "🗑️ Eliminar" : null}
              </button>
            </div>
          ))}

          {/* Botón agregar producto */}
          <button
            type="button"
            onClick={handleAddRow}
            className="text-blue-500 hover:text-blue-700 font-semibold block mx-auto mt-4"
          >
            ➕ Agregar Producto
          </button>
        </div>
      </div>
      {/*Donde Finaliza el escritorio*/}
    </div>
  );
};
