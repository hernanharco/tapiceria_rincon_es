import { useEffect, useRef, useState } from "react";

export const TableDocuments = ({
  filteredProducts,
  setFilteredProducts,
  onProductsChange,
  onDeleteRow,
}) => {
  const lastSerializedProductsRef = useRef("");
  const [activeGroupIdx, setActiveGroupIdx] = useState(0);

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

  // Reset active group index cuando se agrega/elimina un grupo
  useEffect(() => {
    const maxGroup = Math.ceil(filteredProducts.length / 3) - 1;
    if (activeGroupIdx > maxGroup) {
      setActiveGroupIdx(Math.max(0, maxGroup));
    }
  }, [filteredProducts.length, activeGroupIdx]);

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
    <div className="border-0 md:border md:border-gray-300 rounded-none md:rounded-lg bg-transparent md:bg-white shadow-none md:shadow-sm overflow-hidden flex flex-col">

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
                  {/* DESCRIPCIÓN (primera del grupo): Ref + Descripción, sin numéricos */}
              {isFirstInGroup ? (
                <>
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
                  <td className="p-2" colSpan={5}>
                    <textarea 
                      rows={2} 
                      value={item.descripcion || ""} 
                      onChange={(e) => handleChange(idx, "descripcion", e.target.value)} 
                      className="w-full p-1 text-sm rounded border resize-y focus:ring-1 focus:ring-blue-400 outline-none" 
                    />
                  </td>
                  <td className="p-2 text-center"></td>
                </>
              ) : (
                <>
                  {/* MATERIALES / MANO DE OBRA: badge + Cant + Precio + Dto% + Importe */}
                  <td className="p-2 text-center"></td>
                  <td className="p-2"></td>
                  <td className="p-2">
                    <span className={`text-[10px] font-black px-2 py-1 rounded block text-center ${
                      item.descripcion === "Materiales" 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {item.descripcion}
                    </span>
                  </td>
                  <td className="p-2">
                    <input 
                      type="number" 
                      value={item.cantidad ?? ""} 
                      onChange={(e) => handleChange(idx, "cantidad", e.target.value)} 
                      className="w-full text-center text-sm border rounded p-1 focus:ring-1 focus:ring-blue-400 outline-none" 
                    />
                  </td>
                  <td className="p-2">
                    <input 
                      type="number" 
                      value={item.precio ?? ""} 
                      onChange={(e) => handleChange(idx, "precio", e.target.value)} 
                      className="w-full text-center text-sm border rounded p-1 focus:ring-1 focus:ring-blue-400 outline-none" 
                    />
                  </td>
                  <td className="p-2">
                    <input 
                      type="number" 
                      value={item.dto ?? ""} 
                      onChange={(e) => handleChange(idx, "dto", e.target.value)} 
                      className="w-full text-center text-sm border rounded p-1 focus:ring-1 focus:ring-blue-400 outline-none" 
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
                </>
              )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- VISTA MÓVIL: UN GRUPO A LA VEZ CON NAVEGACIÓN --- */}
      <div className="md:hidden bg-gray-50">
        {/* Indicador de progreso: bolitas */}
        {totalBloques > 0 && (
          <div className="flex justify-center gap-1.5 pt-3 pb-2">
            {Array.from({ length: totalBloques }).map((_, i) => (
              <span
                key={i}
                className={`block h-2 rounded-full transition-all duration-300 ${
                  i === activeGroupIdx
                    ? 'w-6 bg-blue-600'
                    : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}

        {/* Grupo activo — UNO SOLO */}
        {totalBloques > 0 && (() => {
          const blockIdx = activeGroupIdx;
          const startIdx = blockIdx * 3;
          const group = filteredProducts.slice(startIdx, startIdx + 3);

          return (
            <div className="px-2 pb-2" key={`group-${blockIdx}-${filteredProducts.length}`}>
              <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {/* Cabecera del Bloque */}
                <div className="bg-blue-600 p-3 flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/20 text-white text-xs font-black shrink-0">
                      {blockIdx + 1}
                    </span>
                    <span className="text-white font-bold text-sm truncate">
                      Grupo <span className="opacity-70 font-normal">de {totalBloques}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => { handleAddRow(e); setActiveGroupIdx(totalBloques); }}
                      className="bg-white/20 hover:bg-blue-500 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all active:scale-90"
                      title="Agregar nuevo grupo"
                    >
                      + Agregar
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(startIdx, e)}
                      className="bg-white/20 hover:bg-red-500 text-white px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase active:scale-90"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* 3 filas del grupo: Descripción, Materiales, Mano de Obra */}
                <div className="p-2 space-y-1.5">
                  {group.map((item, localIdx) => {
                    const globalIdx = startIdx + localIdx;
                    const isSystem = isSystemRow(item.descripcion);

                    const rowStyle =
                      localIdx === 0
                        ? { borderColor: 'border-l-blue-500', bgColor: 'bg-blue-50/50', label: 'DESCRIPCIÓN', labelBg: 'bg-blue-600', accent: '#3b82f6', accentBorder: '#93c5fd' }
                        : localIdx === 1
                          ? { borderColor: 'border-l-emerald-500', bgColor: 'bg-emerald-50/40', label: 'MATERIALES', labelBg: 'bg-emerald-600', accent: '#10b981', accentBorder: '#6ee7b7' }
                          : { borderColor: 'border-l-amber-500', bgColor: 'bg-amber-50/40', label: 'MANO DE OBRA', labelBg: 'bg-amber-600', accent: '#f59e0b', accentBorder: '#fcd34d' };

                    return (
                      <div
                        key={globalIdx}
                        className={`border-l-4 ${rowStyle.borderColor} ${rowStyle.bgColor} rounded-r-xl p-3 space-y-2`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full text-white ${rowStyle.labelBg}`}>
                            {rowStyle.label}
                          </span>
                        </div>

                        {/* DESCRIPCIÓN: solo Ref + Descripción */}
                        {localIdx === 0 ? (
                          <div className="grid grid-cols-12 gap-1.5">
                            <div className="col-span-4">
                              <label className="text-[8px] text-gray-400 uppercase font-bold block mb-0.5">Ref</label>
                              <input
                                type="text"
                                value={item.referencia || ""}
                                onChange={(e) => handleChange(globalIdx, "referencia", e.target.value)}
                                className="w-full text-xs border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none bg-white"
                              />
                            </div>
                            <div className="col-span-8">
                              <label className="text-[8px] text-gray-400 uppercase font-bold block mb-0.5">Descripción</label>
                              <textarea
                                rows={2}
                                value={item.descripcion || ""}
                                onChange={(e) => handleChange(globalIdx, "descripcion", e.target.value)}
                                className="w-full text-xs border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none resize-none bg-white"
                              />
                            </div>
                          </div>
                        ) : (
                          /* MATERIALES / MANO DE OBRA: solo Cant + Precio + Dto% + Total */
                          <div className="grid grid-cols-4 gap-1">
                            <div>
                              <label className="text-[8px] text-gray-400 uppercase font-bold block mb-0.5 text-center">Cant</label>
                              <input
                                type="number"
                                value={item.cantidad ?? ""}
                                onChange={(e) => handleChange(globalIdx, "cantidad", e.target.value)}
                                className="w-full text-center text-xs border rounded-lg p-2 bg-white font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] text-gray-400 uppercase font-bold block mb-0.5 text-center">Precio</label>
                              <input
                                type="number"
                                value={item.precio ?? ""}
                                onChange={(e) => handleChange(globalIdx, "precio", e.target.value)}
                                className="w-full text-center text-xs border rounded-lg p-2 bg-white font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] text-gray-400 uppercase font-bold block mb-0.5 text-center">Dto %</label>
                              <input
                                type="number"
                                value={item.dto ?? ""}
                                onChange={(e) => handleChange(globalIdx, "dto", e.target.value)}
                                className="w-full text-center text-xs border rounded-lg p-2 bg-white font-semibold"
                              />
                            </div>
                            <div>
                              <label className="text-[8px] uppercase font-bold block mb-0.5 text-center" style={{ color: rowStyle.accent }}>Total</label>
                              <input
                                type="number"
                                value={item.importe ?? ""}
                                readOnly={true}
                                className="w-full text-center text-xs border rounded-lg p-2 font-bold bg-white"
                                style={{ borderColor: rowStyle.accentBorder, color: rowStyle.accent }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navegación entre grupos */}
              <div className="flex items-center justify-between mt-3 px-1">
                <button
                  type="button"
                  onClick={() => setActiveGroupIdx((prev) => Math.max(0, prev - 1))}
                  disabled={activeGroupIdx === 0}
                  className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeGroupIdx === 0
                      ? 'text-gray-300'
                      : 'text-blue-600 bg-white border border-blue-200 active:scale-95'
                  }`}
                >
                  ← Anterior
                </button>

                <span className="text-[10px] font-bold text-gray-400">
                  {activeGroupIdx + 1} / {totalBloques}
                </span>

                <button
                  type="button"
                  onClick={() => setActiveGroupIdx((prev) => Math.min(totalBloques - 1, prev + 1))}
                  disabled={activeGroupIdx === totalBloques - 1}
                  className={`flex items-center gap-1 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeGroupIdx === totalBloques - 1
                      ? 'text-gray-300'
                      : 'text-blue-600 bg-white border border-blue-200 active:scale-95'
                  }`}
                >
                  Siguiente →
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      <div className="hidden md:flex p-4 bg-gray-50 border-t justify-center">
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