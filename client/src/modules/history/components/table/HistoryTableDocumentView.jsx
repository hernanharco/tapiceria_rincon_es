import React from "react";
import {
  FaEdit,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCheck,
  FaTrash,
} from "react-icons/fa";
import dayjs from "dayjs";

export const HistoryTableDocumentView = ({
  sortedProducts,
  setShowModal,
  isDisabled,
  handleUpdate,
  handlePrint,
  handleDeleteFactura,
  toggleChecklistItem,
  sortConfig,
  requestSort,
}) => {
  const btnBase =
    "p-2 rounded-full transition-all duration-200 transform hover:scale-125 inline-flex items-center justify-center";
  const editStyle = `${btnBase} text-blue-600 hover:bg-blue-300 hover:text-blue-900`;
  const deleteStyle = `${btnBase} text-red-500 hover:bg-red-300 hover:text-red-900`;
  const checkStyle = `${btnBase} hover:bg-yellow-300`;

  //console.log("sortedProducts", sortedProducts);

  return (
    <>
      {/* Vista de escritorio */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {[
                { label: "Cliente", key: "clienteNombre" },
                { label: "Presupuesto", key: "num_presupuesto" },
                { label: "Albarán", key: "num_albaran" },
                { label: "Factura", key: "num_factura" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-200"
                  onClick={() => requestSort(col.key)}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>{col.label}</span>
                    {sortConfig.key === col.key ? (
                      sortConfig.direction === "asc" ? (
                        <FaSortUp />
                      ) : (
                        <FaSortDown />
                      )
                    ) : (
                      <FaSort />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            <tr>
              <td colSpan={4} className="px-6 py-4 text-center">
                <button
                  onClick={() => setShowModal(true)}
                  disabled={isDisabled}
                  className={`px-4 py-2 rounded-md text-white font-medium transition-all ${isDisabled
                      ? "bg-gray-400"
                      : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                    }`}
                >
                  Agregar Nuevo Documento
                </button>
              </td>
            </tr>

            {sortedProducts.map((item, idx) => {
              const nombreEscritorio =
                item.clienteNombre?.length > 24
                  ? item.clienteNombre.substring(0, 24) + "..."
                  : item.clienteNombre || "-";

              const isAnulado = item.observaciones
                ?.toLowerCase()
                .includes("anulado");

              return (
                <tr
                  key={idx}
                  className={`transition-colors ${isAnulado
                      ? "bg-red-200 hover:bg-red-300"
                      : "hover:bg-gray-50"
                    }`}
                >
                  <td
                    className="px-6 py-4 text-center text-gray-700 text-xs font-medium"
                    title={item.clienteNombre}
                  >
                    {nombreEscritorio}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div
                      onClick={() => handlePrint(item.num_presupuesto, "PRESUPUESTO", item.dataclient)}
                      className="cursor-pointer font-bold text-blue-700 hover:text-blue-900 hover:underline transition-all"
                    >
                      {item.num_presupuesto || "-"}
                    </div>
                    <div className="text-xs text-gray-500 mb-2 font-mono">
                      {item.fecha_factura &&
                        dayjs(item.fecha_factura).format("DD/MM/YYYY")}
                    </div>
                    <div className="flex justify-center items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChecklistItem(item.id, "1");
                        }}
                        disabled={!!item.num_albaran}
                        className={`${checkStyle} ${item.num_albaran
                            ? "opacity-50 cursor-not-allowed transform-none"
                            : ""
                          }`}
                      >
                        <div
                          className={`w-7 h-7 flex items-center justify-center rounded-full border shadow-sm ${item.num_presupuesto
                              ? "bg-blue-600 border-blue-600 text-white"
                              : "bg-white border-gray-400 text-gray-400"
                            }`}
                        >
                          {item.num_presupuesto && (
                            <FaCheck className="w-3 h-3" />
                          )}
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdate(item);
                        }}
                        className={editStyle}
                        title="Editar"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFactura(item);
                        }}
                        className={deleteStyle}
                        title="Eliminar"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-center">
                    <div
                      onClick={() => item.num_albaran && handlePrint(item.num_albaran, "ALBARAN", item.dataclient)}
                      className={`font-semibold transition-all ${item.num_albaran ? "text-blue-700 cursor-pointer hover:underline" : "text-gray-400"}`}
                    >
                      {item.num_albaran || "-"}
                    </div>
                    <div className="text-xs text-gray-500 mb-2 font-mono">
                      {item.fecha_factalb &&
                        dayjs(item.fecha_factalb).format("DD/MM/YYYY")}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleChecklistItem(item.id, "2");
                      }}
                      disabled={!!item.num_factura}
                      className={`${checkStyle} mt-1 ${item.num_factura
                          ? "opacity-50 cursor-not-allowed transform-none"
                          : ""
                        }`}
                    >
                      <div
                        className={`w-7 h-7 flex items-center justify-center rounded-full border ${item.num_albaran
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-400 text-gray-400"
                          }`}
                      >
                        {item.num_albaran && <FaCheck className="w-3 h-3" />}
                      </div>                      
                    </button>
                  </td>

                  <td className="px-6 py-4 text-center font-bold">
                    <div
                      onClick={() => item.num_factura && handlePrint(item.num_factura, "FACTURA", item.dataclient)}
                      className={`${item.num_factura ? "text-blue-800 cursor-pointer hover:underline" : "text-gray-400"}`}
                    >
                      {item.num_factura || "-"}
                    </div>
                    <div className="text-xs text-gray-500 mb-2 font-mono">
                      {item.datefactura &&
                        dayjs(item.datefactura).format("DD/MM/YYYY")}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="block md:hidden space-y-4 px-2">
        <button
          onClick={() => setShowModal(true)}
          disabled={isDisabled}
          className={`w-full px-4 py-3 rounded-lg text-white font-bold shadow-md transition-all ${isDisabled
              ? "bg-gray-400"
              : "bg-green-600 hover:bg-green-700 active:scale-95"
            }`}
        >
          + Agregar Nuevo Documento
        </button>

        {sortedProducts.map((item, idx) => (
          <div
            key={item.id || idx}
            className={`rounded-xl shadow-sm p-4 border-2 transition-all ${item.observaciones?.toLowerCase().includes("anulado")
                ? "bg-red-50 border-red-200"
                : "bg-white border-gray-100"
              }`}
          >
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
              Cliente
            </p>
            <p className="font-bold text-gray-800 border-b pb-2 mb-3 truncate">
              {item.clienteNombre || "-"}
            </p>

            <div className="mt-2 flex justify-between items-center">
              <div className="space-y-4 flex-1">
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Presupuesto</p>
                  <div
                    onClick={() => handlePrint(item.num_presupuesto, "PRESUPUESTO", item.dataclient)}
                    className="cursor-pointer active:opacity-50"
                  >
                    <p className="font-black text-blue-800 text-lg leading-tight">
                      {item.num_presupuesto || "-"}
                    </p>
                    <p className="text-xs text-gray-500 font-mono">
                      {item.fecha_factura &&
                        dayjs(item.fecha_factura).format("DD/MM/YYYY")}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Albarán</p>
                  <p
                    onClick={() => item.num_albaran && handlePrint(item.num_albaran, "ALBARAN", item.dataclient)}
                    className={`font-bold ${item.num_albaran ? "text-blue-700 cursor-pointer" : "text-gray-400"}`}
                  >
                    {item.num_albaran || "-"}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {item.fecha_factalb &&
                      dayjs(item.fecha_factalb).format("DD/MM/YYYY")}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Factura</p>
                  <p
                    onClick={() => item.num_factura && handlePrint(item.num_factura, "FACTURA", item.dataclient)}
                    className={`font-bold ${item.num_factura ? "text-blue-900 cursor-pointer" : "text-gray-400"}`}
                  >
                    {item.num_factura || "-"}
                  </p>
                  <p className="text-xs text-gray-500 font-mono">
                    {item.datefactura &&
                      dayjs(item.datefactura).format("DD/MM/YYYY")}
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-4 items-center px-2 bg-gray-50 py-2 rounded-lg border border-gray-100 ml-2">
                <button
                  onClick={() => toggleChecklistItem(item.id, "1")}
                  disabled={!!item.num_albaran}
                  className={`${checkStyle} ${item.num_albaran
                      ? "opacity-50 cursor-not-allowed transform-none"
                      : "active:scale-110"
                    }`}
                >
                  <div
                    className={`w-9 h-9 flex items-center justify-center rounded-full border shadow-sm transition-colors ${item.num_presupuesto
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-400 text-gray-400"
                      }`}
                  >
                    {item.num_presupuesto && <FaCheck className="w-4 h-4" />}
                  </div>
                </button>
                <button
                  onClick={() => handleUpdate(item)}
                  className={`${editStyle} active:scale-110`}
                >
                  <FaEdit size={22} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleChecklistItem(item.id, "2");
                  }}
                  disabled={!item.num_albaran || !!item.num_factura}
                  className={`${checkStyle} ${(!item.num_albaran || !!item.num_factura)
                          ? "opacity-50 cursor-not-allowed transform-none"
                          : "active:scale-110"
                        }`}
                >
                  <div
                    className={`w-7 h-7 flex items-center justify-center rounded-full border ${item.num_albaran
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-400 text-gray-400"
                      }`}
                  >
                    {item.num_albaran && <FaCheck className="w-3 h-3" />}
                  </div>
                </button>
                <button
                  onClick={() => handleDeleteFactura(item)}
                  className={`${deleteStyle} active:scale-110`}
                >
                  <FaTrash size={22} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};