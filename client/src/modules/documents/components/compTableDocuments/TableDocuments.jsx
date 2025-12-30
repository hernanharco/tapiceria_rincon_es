import { useEffect, useRef } from "react";
//import { formatCurrency } from "../../../../utils/formatUtils";

export const TableDocuments = ({
  filteredProducts,
  setFilteredProducts,
  onProductsChange,
  onDeleteRow,
}) => {
  
  const lastSerializedProductsRef = useRef("");

  useEffect(() => {
    const currentSerialized = JSON.stringify(filteredProducts);
    if (typeof onProductsChange === "function" && lastSerializedProductsRef.current !== currentSerialized) {
      lastSerializedProductsRef.current = currentSerialized;
      onProductsChange(filteredProducts);
    }
  }, [filteredProducts, onProductsChange]);

  const handleAddRow = (e) => {
    if (e) e.preventDefault();
    const newRows = [
      { referencia: "", descripcion: "", cantidad: "", precio: "", dto: "", importe: "" },
      { referencia: "", descripcion: "Materiales", cantidad: 1, precio: 0, dto: 0, importe: 0 },
      { referencia: "", descripcion: "Mano de Obra", cantidad: 1, precio: 0, dto: 0, importe: 0 },
    ];
    setFilteredProducts([...filteredProducts, ...newRows]);
  };

  const handleChange = (index, field, value) => {
    const updatedList = [...filteredProducts];
    updatedList[index][field] = value;

    if (["precio", "cantidad", "dto", "importe"].includes(field)) {
      const precio = parseFloat(updatedList[index].precio) || 0;
      const cantidad = parseFloat(updatedList[index].cantidad) || 0;
      const dto = parseFloat(updatedList[index].dto) || 0;

      if (field !== "importe") {
        const subtotal = precio * cantidad;
        const discount = subtotal * (dto / 100);
        updatedList[index].importe = (subtotal - discount).toFixed(2);
      } else if (field === "importe" && precio > 0 && cantidad > 0) {
        const calculatedDto = 100 - (value / (precio * cantidad)) * 100;
        updatedList[index].dto = isNaN(calculatedDto) ? 0 : calculatedDto.toFixed(2);
      }
    }
    setFilteredProducts(updatedList);
  };

  const handleDelete = (index, e) => {
    if (e) e.preventDefault();
    if (onDeleteRow) {
      onDeleteRow([...filteredProducts], index);
    }
  };

  const isSystemRow = (desc) => desc === "Materiales" || desc === "Mano de Obra";

  // Cálculo del total de bloques (grupos de 3)
  const totalBloques = Math.ceil(filteredProducts.length / 3);

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden flex flex-col">
      
      {/* Indicador de cantidad total de grupos */}
      <div className="bg-blue-50 p-2 border-b border-blue-100 flex justify-between items-center px-4">
        <span className="text-blue-800 text-xs font-bold uppercase tracking-wider">
          Resumen de Estructura
        </span>
        <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold">
          {totalBloques} {totalBloques === 1 ? 'Grupo' : 'Grupos'} en total
        </span>
      </div>

      {/* --- VISTA ESCRITORIO --- */}
      <div className="hidden md:block w-full overflow-y-auto max-h-[450px]"> 
        <table className="w-full table-auto border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm">
            <tr className="text-gray-700 font-semibold text-[11px] uppercase">
              <th className="border-b p-2 w-16 text-center">Bloque</th>
              <th className="border-b p-2">Ref</th>
              <th className="border-b p-2 w-2/5">Descripción</th>
              <th className="border-b p-2 text-center">Cant</th>
              <th className="border-b p-2 text-center">Precio</th>
              <th className="border-b p-2 text-center">Dto %</th>
              <th className="border-b p-2 text-center">Importe</th>
              <th className="border-b p-2 text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((item, idx) => {
              // Solo mostramos el número de bloque en la primera fila de cada 3
              const isFirstInGroup = idx % 3 === 0;
              const currentGroupNum = Math.floor(idx / 3) + 1;

              return (
                <tr key={idx} className={`hover:bg-gray-50 border-b last:border-0 ${isFirstInGroup ? "border-t-2 border-t-blue-100" : ""}`}>
                  <td className="p-2 text-center font-bold text-blue-400 text-xs">
                    {isFirstInGroup ? `#${currentGroupNum}` : ""}
                  </td>
                  <td className="p-2 text-center">
                    <input
                      type="text"
                      value={item.referencia}
                      onChange={(e) => handleChange(idx, "referencia", e.target.value)}
                      className={`w-full text-center text-sm ${isSystemRow(item.descripcion) ? "border rounded p-1" : "bg-transparent outline-none"}`}
                    />
                  </td>
                  <td className="p-2">
                    <textarea
                      rows={isSystemRow(item.descripcion) ? 1 : 2}
                      value={item.descripcion}
                      readOnly={isSystemRow(item.descripcion)}
                      onChange={(e) => handleChange(idx, "descripcion", e.target.value)}
                      className={`w-full p-1 text-sm rounded border ${isSystemRow(item.descripcion) ? "bg-gray-100 text-center font-bold" : "resize-y"}`}
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.cantidad}
                      onChange={(e) => handleChange(idx, "cantidad", e.target.value)}
                      className="w-full text-center text-sm border rounded p-1"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.precio}
                      onChange={(e) => handleChange(idx, "precio", e.target.value)}
                      className="w-full text-center text-sm border rounded p-1"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.dto}
                      onChange={(e) => handleChange(idx, "dto", e.target.value)}
                      className="w-full text-center text-sm border rounded p-1"
                    />
                  </td>
                  <td className="p-2">
                    <input
                      type="number"
                      value={item.importe}
                      onChange={(e) => handleChange(idx, "importe", e.target.value)}
                      className="w-full text-center text-sm border rounded p-1 font-semibold text-blue-700"
                    />
                  </td>
                  <td className="p-2 text-center">
                    {item.descripcion === "Mano de Obra" && (
                      <button 
                        type="button" 
                        onClick={(e) => handleDelete(idx, e)} 
                        className="text-red-500 hover:scale-110 transition-transform"
                        title="Eliminar grupo completo"
                      >
                        🗑️
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- VISTA MÓVIL --- */}
      <div className="md:hidden divide-y divide-gray-200 overflow-y-auto max-h-[500px]">
        {filteredProducts.map((item, idx) => (
          <div key={idx} className={`p-4 ${isSystemRow(item.descripcion) ? "bg-gray-50" : "bg-white"}`}>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">
                GRUPO #{Math.floor(idx / 3) + 1} - {item.descripcion || "Descripción libre"}
              </span>
              {item.descripcion === "Mano de Obra" && (
                <button 
                  type="button" 
                  onClick={(e) => handleDelete(idx, e)} 
                  className="text-red-500 text-sm font-medium"
                >
                  Eliminar Bloque
                </button>
              )}
            </div>
            {/* Resto de inputs móvil igual que antes... */}
          </div>
        ))}
      </div>

      {/* Botón Agregar */}
      <div className="p-4 bg-gray-50 border-t flex justify-center sticky bottom-0">
        <button
          type="button"
          onClick={handleAddRow}
          className="flex items-center gap-2 bg-white border border-blue-500 text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 transition-colors shadow-sm text-sm"
        >
          <span>➕</span> Agregar Grupo {totalBloques + 1}
        </button>
      </div>
    </div>
  );
};