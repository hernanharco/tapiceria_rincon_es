import { useEffect, useRef } from "react";

export const TableDocuments = ({
  filteredProducts,
  setFilteredProducts,
  onProductsChange,
  onDeleteRow,
}) => {
  const lastSerializedProductsRef = useRef("");

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
    const blockStartIndex = Math.floor(index / 3) * 3;
    if (typeof onDeleteRow === "function") {
      onDeleteRow([...filteredProducts], blockStartIndex);
    } else {
      const newList = [...filteredProducts];
      newList.splice(blockStartIndex, 3);
      setFilteredProducts(newList);
    }
  };

  const isSystemRow = (desc) => desc === "Materiales" || desc === "Mano de Obra";
  const totalBloques = Math.ceil(filteredProducts.length / 3);

  return (
    <div className="border border-gray-300 rounded-lg bg-white shadow-sm overflow-hidden flex flex-col">
      <div className="bg-blue-50 p-2 border-b border-blue-100 flex justify-between items-center px-4">
        <span className="text-blue-800 text-xs font-bold uppercase tracking-wider">Resumen de Estructura</span>
        <span className="bg-blue-600 text-white text-xs px-3 py-1 rounded-full font-bold">
          {totalBloques} {totalBloques === 1 ? "Grupo" : "Grupos"} en total
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
              const isFirstInGroup = idx % 3 === 0;
              const isSystem = isSystemRow(item.descripcion);
              const currentGroupNum = Math.floor(idx / 3) + 1;

              return (
                <tr key={idx} className={`hover:bg-gray-50 border-b last:border-0 ${isFirstInGroup ? "border-t-2 border-t-blue-100" : ""}`}>
                  <td className="p-2 text-center font-bold text-blue-400 text-xs">{isFirstInGroup ? `#${currentGroupNum}` : ""}</td>
                  <td className="p-2 text-center">
                    <input type="text" value={item.referencia} onChange={(e) => handleChange(idx, "referencia", e.target.value)} className={`w-full text-center text-sm ${isSystem ? "border rounded p-1" : "bg-transparent outline-none"}`} />
                  </td>
                  <td className="p-2">
                    <textarea rows={isSystem ? 1 : 2} value={item.descripcion} readOnly={isSystem} onChange={(e) => handleChange(idx, "descripcion", e.target.value)} className={`w-full p-1 text-sm rounded border ${isSystem ? "bg-gray-100 text-center font-bold" : "resize-y"}`} />
                  </td>
                  {/* Campos Condicionales */}
                  <td className="p-2">
                    <input type="number" value={item.cantidad} readOnly={!isSystem} onChange={(e) => handleChange(idx, "cantidad", e.target.value)} className={`w-full text-center text-sm border rounded p-1 ${!isSystem ? "bg-gray-50 border-transparent text-gray-400" : ""}`} />
                  </td>
                  <td className="p-2">
                    <input type="number" value={item.precio} readOnly={!isSystem} onChange={(e) => handleChange(idx, "precio", e.target.value)} className={`w-full text-center text-sm border rounded p-1 ${!isSystem ? "bg-gray-50 border-transparent text-gray-400" : ""}`} />
                  </td>
                  <td className="p-2">
                    <input type="number" value={item.dto} readOnly={!isSystem} onChange={(e) => handleChange(idx, "dto", e.target.value)} className={`w-full text-center text-sm border rounded p-1 ${!isSystem ? "bg-gray-50 border-transparent text-gray-400" : ""}`} />
                  </td>
                  <td className="p-2">
                    <input type="number" value={item.importe} readOnly={!isSystem} onChange={(e) => handleChange(idx, "importe", e.target.value)} className={`w-full text-center text-sm border rounded p-1 font-semibold ${!isSystem ? "bg-gray-50 border-transparent text-gray-400" : "text-blue-700"}`} />
                  </td>
                  <td className="p-2 text-center">
                    {item.descripcion === "Mano de Obra" && (
                      <button type="button" onClick={(e) => handleDelete(idx, e)} className="text-red-500 hover:scale-110 transition-transform">🗑️</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* --- VISTA MÓVIL (Cards) --- */}
      <div className="md:hidden p-3 space-y-6 overflow-y-auto max-h-[600px] bg-gray-100">
        {filteredProducts.reduce((acc, curr, i) => {
          if (i % 3 === 0) acc.push(filteredProducts.slice(i, i + 3));
          return acc;
        }, []).map((group, blockIdx) => {
          const startIdx = blockIdx * 3;
          return (
            <div key={blockIdx} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-3 flex justify-between items-center">
                <span className="text-white font-bold text-xs tracking-widest uppercase">Bloque #{blockIdx + 1}</span>
                <button type="button" onClick={(e) => handleDelete(startIdx, e)} className="bg-red-500/20 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold border border-white/20">Eliminar</button>
              </div>
              <div className="p-4 space-y-6">
                {group.map((item, localIdx) => {
                  const globalIdx = startIdx + localIdx;
                  const isSystem = isSystemRow(item.descripcion);
                  return (
                    <div key={globalIdx} className={`space-y-3 ${localIdx < group.length - 1 ? "pb-6 border-b border-dashed border-gray-200" : ""}`}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${isSystem ? "bg-orange-400" : "bg-blue-400"}`}></span>
                        <span className="text-[10px] font-black uppercase text-gray-400">{isSystem ? item.descripcion : "Descripción Principal"}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="col-span-2">
                          <label className="text-[9px] text-gray-400 font-bold ml-1 uppercase">Detalle</label>
                          <textarea rows={isSystem ? 1 : 2} value={item.descripcion} readOnly={isSystem} onChange={(e) => handleChange(globalIdx, "descripcion", e.target.value)} className={`w-full p-3 text-sm rounded-xl border ${isSystem ? "bg-gray-50 border-gray-100 font-bold" : "border-blue-100 shadow-sm"}`} />
                        </div>
                        <div className="col-span-2">
                          <label className="text-[9px] text-gray-400 font-bold ml-1 uppercase">Referencia</label>
                          <input type="text" value={item.referencia} onChange={(e) => handleChange(globalIdx, "referencia", e.target.value)} className="w-full p-2.5 text-sm border border-gray-200 rounded-xl" />
                        </div>
                        {/* Campos Numéricos con readOnly condicional */}
                        <div>
                          <label className="text-[9px] text-gray-400 font-bold ml-1 uppercase">Cant</label>
                          <input type="number" value={item.cantidad} readOnly={!isSystem} onChange={(e) => handleChange(globalIdx, "cantidad", e.target.value)} className={`w-full p-2.5 text-sm border rounded-xl text-center ${!isSystem ? "bg-gray-50 text-gray-400" : "font-semibold"}`} />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-400 font-bold ml-1 uppercase">Precio</label>
                          <input type="number" value={item.precio} readOnly={!isSystem} onChange={(e) => handleChange(globalIdx, "precio", e.target.value)} className={`w-full p-2.5 text-sm border rounded-xl text-center ${!isSystem ? "bg-gray-50 text-gray-400" : "font-semibold"}`} />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-400 font-bold ml-1 uppercase">Dto %</label>
                          <input type="number" value={item.dto} readOnly={!isSystem} onChange={(e) => handleChange(globalIdx, "dto", e.target.value)} className={`w-full p-2.5 text-sm border rounded-xl text-center ${!isSystem ? "bg-gray-50 text-gray-400" : "bg-orange-50 text-orange-600 font-bold"}`} />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-400 font-bold ml-1 uppercase text-blue-600">Importe</label>
                          <input type="number" value={item.importe} readOnly={!isSystem} onChange={(e) => handleChange(globalIdx, "importe", e.target.value)} className={`w-full p-2.5 text-sm border rounded-xl text-center ${!isSystem ? "bg-gray-50 text-gray-400" : "bg-blue-50 text-blue-700 font-black shadow-inner"}`} />
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
        <button type="button" onClick={handleAddRow} className="flex items-center gap-2 bg-white border border-blue-500 text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-blue-50 shadow-sm text-sm">
          <span>➕</span> Agregar Grupo {totalBloques + 1}
        </button>
      </div>
    </div>
  );
};