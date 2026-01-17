import { useEffect, useRef } from "react";

export const TableDocuments = ({
  filteredProducts,
  setFilteredProducts,
  onProductsChange,
  onDeleteRow,
}) => {
  const lastSerializedProductsRef = useRef("");

  // Sincronización con el padre para totales
  useEffect(() => {
    const currentSerialized = JSON.stringify(filteredProducts);
    if (
      typeof onProductsChange === "function" &&
      lastSerializedProductsRef.current !== currentSerialized
    ) {
      lastSerializedProductsRef.current = currentSerialized;
      onProductsChange(filteredProducts);
    }
  }, [filteredProducts, onProductsChange]);

  const handleAddRow = (e) => {
    if (e) e.preventDefault();
    const newRows = [
      { referencia: "", descripcion: "", cantidad: 0, precio: 0, dto: 0, importe: 0 },
      { referencia: "", descripcion: "Materiales", cantidad: 1, precio: 0, dto: 0, importe: 0 },
      { referencia: "", descripcion: "Mano de Obra", cantidad: 1, precio: 0, dto: 0, importe: 0 },
    ];
    setFilteredProducts([...filteredProducts, ...newRows]);
  };

  const handleChange = (index, field, value) => {
    const updatedList = [...filteredProducts];
    const item = { ...updatedList[index] };
    item[field] = value;

    if (["precio", "cantidad", "dto", "importe"].includes(field)) {
      const precio = parseFloat(item.precio) || 0;
      const cantidad = parseFloat(item.cantidad) || 0;
      const dto = parseFloat(item.dto) || 0;

      if (field !== "importe") {
        const subtotal = precio * cantidad;
        const discount = subtotal * (dto / 100);
        item.importe = (subtotal - discount).toFixed(2);
      } else if (precio > 0 && cantidad > 0) {
        const calculatedDto = 100 - (value / (precio * cantidad)) * 100;
        item.dto = isNaN(calculatedDto) ? 0 : calculatedDto.toFixed(2);
      }
    }
    updatedList[index] = item;
    setFilteredProducts(updatedList);
  };

  const handleDelete = (index, e) => {
    if (e) e.preventDefault();
    const blockStartIndex = Math.floor(index / 3) * 3;
    const newList = filteredProducts.filter((_, i) => 
      i < blockStartIndex || i >= blockStartIndex + 3
    );
    setFilteredProducts(newList);
    if (typeof onDeleteRow === "function") {
      onDeleteRow(newList, blockStartIndex);
    }
  };

  const isSystemRow = (desc) => desc === "Materiales" || desc === "Mano de Obra";
  const totalBloques = Math.ceil(filteredProducts.length / 3);

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="bg-blue-50 p-2 border-b border-blue-100 flex justify-between items-center px-4">
        <span className="text-blue-800 text-xs font-bold uppercase tracking-wider">Resumen de Estructura</span>
        <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold">
          {totalBloques} {totalBloques === 1 ? "Grupo" : "Grupos"}
        </span>
      </div>

      {/* --- VISTA ESCRITORIO (TABLA) --- */}
      <div className="hidden md:block w-full overflow-y-auto max-h-[450px]">
        <table className="w-full table-auto border-collapse">
          <thead className="sticky top-0 z-10 bg-gray-100 shadow-sm text-[11px] uppercase text-gray-700 font-semibold">
            <tr>
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
              const isFirstInGroup = idx % 3 === 0;
              const isSystem = isSystemRow(item.descripcion);

              return (
                <tr key={idx} className={`hover:bg-gray-50 border-b last:border-0 ${isFirstInGroup ? "border-t-2 border-t-blue-100" : ""}`}>
                  <td className="p-2 text-center font-bold text-blue-400 text-xs">
                    {isFirstInGroup ? `#${Math.floor(idx / 3) + 1}` : ""}
                  </td>
                  <td className="p-2 text-center">
                    <input 
                      type="text" 
                      value={item.referencia || ""} 
                      onChange={(e) => handleChange(idx, "referencia", e.target.value)} 
                      className="w-full text-center text-sm border rounded p-1 focus:ring-1 focus:ring-blue-400 outline-none transition-all" 
                    />
                  </td>
                  <td className="p-2">
                    <textarea 
                      rows={isSystem ? 1 : 2} 
                      value={item.descripcion || ""} 
                      readOnly={isSystem} 
                      onChange={(e) => handleChange(idx, "descripcion", e.target.value)} 
                      className={`w-full p-1 text-sm rounded border ${isSystem ? "bg-gray-100 text-center font-bold" : "resize-y focus:ring-1 focus:ring-blue-400 outline-none"}`} 
                    />
                  </td>
                  <td className="p-2">
                    <input 
                      type="number" 
                      value={item.cantidad ?? ""} 
                      readOnly={!isSystem} 
                      onChange={(e) => handleChange(idx, "cantidad", e.target.value)} 
                      className={`w-full text-center text-sm border rounded p-1 ${!isSystem ? "bg-gray-50 text-gray-400" : ""}`} 
                    />
                  </td>
                  <td className="p-2">
                    <input 
                      type="number" 
                      value={item.precio ?? ""} 
                      readOnly={!isSystem} 
                      onChange={(e) => handleChange(idx, "precio", e.target.value)} 
                      className={`w-full text-center text-sm border rounded p-1 ${!isSystem ? "bg-gray-50 text-gray-400" : ""}`} 
                    />
                  </td>
                  <td className="p-2">
                    <input 
                      type="number" 
                      value={item.dto ?? ""} 
                      readOnly={!isSystem} 
                      onChange={(e) => handleChange(idx, "dto", e.target.value)} 
                      className={`w-full text-center text-sm border rounded p-1 ${!isSystem ? "bg-gray-50 text-gray-400" : ""}`} 
                    />
                  </td>
                  <td className="p-2">
                    <input 
                      type="number" 
                      value={item.importe ?? ""} 
                      readOnly={true} 
                      className="w-full text-center text-sm border rounded p-1 font-semibold bg-gray-50 text-blue-700 outline-none" 
                    />
                  </td>
                  <td className="p-2 text-center">
                    {item.descripcion === "Mano de Obra" && (
                      <button 
                        type="button" 
                        onClick={(e) => handleDelete(idx, e)} 
                        className="text-red-400 hover:text-red-600 hover:scale-125 transition-all active:scale-90"
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

      {/* --- VISTA MÓVIL (CARDS CON TODOS LOS CAMPOS) --- */}
      <div className="md:hidden p-3 space-y-8 overflow-y-auto max-h-[600px] bg-gray-50">
        {Array.from({ length: totalBloques }).map((_, blockIdx) => {
          const startIdx = blockIdx * 3;
          const group = filteredProducts.slice(startIdx, startIdx + 3);
          
          return (
            <div key={blockIdx} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              {/* Cabecera del Bloque */}
              <div className="bg-blue-600 p-3 flex justify-between items-center">
                <span className="text-white font-bold text-xs uppercase tracking-widest">Grupo #{blockIdx + 1}</span>
                <button 
                  type="button" 
                  onClick={(e) => handleDelete(startIdx, e)} 
                  className="bg-white/20 hover:bg-red-500 text-white px-3 py-1 rounded text-[10px] font-bold transition-colors uppercase border border-white/30"
                >
                  Eliminar Bloque
                </button>
              </div>

              {/* Mapeo de los 3 elementos del bloque en el móvil */}
              <div className="p-3 space-y-6 divide-y divide-gray-100">
                {group.map((item, localIdx) => {
                  const globalIdx = startIdx + localIdx;
                  const isSystem = isSystemRow(item.descripcion);

                  return (
                    <div key={globalIdx} className={`pt-4 first:pt-0 space-y-3`}>
                      {/* Etiqueta de Tipo */}
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded ${isSystem ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>
                          {isSystem ? item.descripcion.toUpperCase() : "DESCRIPCIÓN PRINCIPAL"}
                        </span>
                      </div>

                      {/* Fila: Ref y Descripción */}
                      <div className="grid grid-cols-12 gap-2">
                        <div className="col-span-4">
                          <label className="text-[9px] text-gray-400 uppercase font-bold block mb-1">Ref</label>
                          <input 
                            type="text" 
                            value={item.referencia || ""} 
                            onChange={(e) => handleChange(globalIdx, "referencia", e.target.value)} 
                            className="w-full text-xs border rounded p-2 focus:ring-1 focus:ring-blue-400 outline-none" 
                          />
                        </div>
                        <div className="col-span-8">
                          <label className="text-[9px] text-gray-400 uppercase font-bold block mb-1">Descripción</label>
                          <textarea 
                            rows={isSystem ? 1 : 2}
                            value={item.descripcion || ""} 
                            readOnly={isSystem} 
                            onChange={(e) => handleChange(globalIdx, "descripcion", e.target.value)} 
                            className={`w-full text-xs border rounded p-2 focus:ring-1 focus:ring-blue-400 outline-none ${isSystem ? "bg-gray-50 font-bold" : ""}`} 
                          />
                        </div>
                      </div>

                      {/* Fila: Cant, Precio, Dto e Importe */}
                      <div className="grid grid-cols-4 gap-2">
                        <div>
                          <label className="text-[9px] text-gray-400 uppercase font-bold block mb-1 text-center">Cant</label>
                          <input 
                            type="number" 
                            value={item.cantidad ?? ""} 
                            readOnly={!isSystem} 
                            onChange={(e) => handleChange(globalIdx, "cantidad", e.target.value)} 
                            className={`w-full text-center text-xs border rounded p-2 ${!isSystem ? "bg-gray-100 text-gray-400" : ""}`} 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-400 uppercase font-bold block mb-1 text-center">Precio</label>
                          <input 
                            type="number" 
                            value={item.precio ?? ""} 
                            readOnly={!isSystem} 
                            onChange={(e) => handleChange(globalIdx, "precio", e.target.value)} 
                            className={`w-full text-center text-xs border rounded p-2 ${!isSystem ? "bg-gray-100 text-gray-400" : ""}`} 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-400 uppercase font-bold block mb-1 text-center">Dto %</label>
                          <input 
                            type="number" 
                            value={item.dto ?? ""} 
                            readOnly={!isSystem} 
                            onChange={(e) => handleChange(globalIdx, "dto", e.target.value)} 
                            className={`w-full text-center text-xs border rounded p-2 ${!isSystem ? "bg-gray-100 text-gray-400" : ""}`} 
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-blue-600 uppercase font-bold block mb-1 text-center">Total</label>
                          <input 
                            type="number" 
                            value={item.importe ?? ""} 
                            readOnly={true} 
                            className="w-full text-center text-xs border border-blue-200 rounded p-2 font-bold bg-blue-50 text-blue-700" 
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-gray-50 border-t flex justify-center sticky bottom-0">
        <button 
          type="button" 
          onClick={handleAddRow} 
          className="flex items-center gap-2 bg-white border border-blue-500 text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 shadow-sm text-sm active:scale-95 transition-all"
        >
          <span>➕</span> Agregar Grupo {totalBloques + 1}
        </button>
      </div>
    </div>
  );
};