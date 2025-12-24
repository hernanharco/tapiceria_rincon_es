import React from "react";
import { FaEdit, FaSort, FaSortUp, FaSortDown, FaCheck } from "react-icons/fa";
import dayjs from "dayjs";

export const HistoryTableDocumentView = ({
  sortedProducts,
  setShowModal,
  isDisabled,
  handleUpdate,
  handlePrint,
  toggleChecklistItem,
  sortConfig,
  requestSort
}) => {

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
                  className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase cursor-pointer"
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
                  className={`px-4 py-2 rounded-md text-white font-medium ${
                    isDisabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  Agregar Nuevo Documento
                </button>
              </td>
            </tr>

            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500 italic">
                  No hay documentos registrados.
                </td>
              </tr>
            ) : (
              sortedProducts.map((item, idx) => (
                <tr
                  key={idx}
                  className={`transition-colors duration-150 hover:bg-gray-50 ${
                    item.observaciones?.toLowerCase().includes("anulado")
                      ? "bg-red-200" // rojo ladrillo para observaciones anulado
                      : item.num_factura
                      ? "bg-gradient-to-r from-blue-50 via-blue-50/80 to-white"
                      : ""
                  }`}
                >
                  {/* Cliente */}
                  <td className="px-6 py-4 text-center text-gray-700 text-xs">
                    {item.clienteNombre
                      ? `${item.clienteNombre.slice(0, 25)}${
                          item.clienteNombre.length > 25 ? "…" : ""
                        }`
                      : "-"}
                  </td>

                  {/* Presupuesto */}
                  <td
                    onClick={() => handlePrint(item)}
                    className={`cursor-pointer px-6 py-4 text-center ${
                      item.num_presupuesto ? "text-blue-800" : ""
                    }`}
                  >
                    <div className="font-semibold text-gray-800">
                      {item.num_presupuesto || "-"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.fecha_factura &&
                        dayjs(item.fecha_factura).format("DD/MM/YYYY")}
                    </div>
                    <div className="mt-2 flex justify-center items-center space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChecklistItem(item.id, "1");
                        }}
                        className={`flex items-center justify-center w-6 h-6 rounded-full border transition-colors duration-200 ${
                          item.num_presupuesto
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-400 text-gray-400"
                        }`}
                        title="Checklist Presupuesto"
                      >
                        {item.num_presupuesto && <FaCheck className="w-3 h-3" />}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdate(item);
                        }}
                        className="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                    </div>
                  </td>

                  {/* Albarán */}
                  <td
                    onClick={() => handlePrint(item, "ALBARAN")}
                    className={`cursor-pointer px-6 py-4 text-center ${
                      item.num_albaran ? "text-blue-800" : ""
                    }`}
                  >
                    <div className="font-semibold text-gray-800">
                      {item.num_albaran || "-"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.fecha_factalb &&
                        dayjs(item.fecha_factalb).format("DD/MM/YYYY")}
                    </div>
                    <div className="mt-2 flex justify-center items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChecklistItem(item.id, "2");
                        }}
                        className={`flex items-center justify-center w-6 h-6 rounded-full border transition-colors duration-200 ${
                          item.num_albaran
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-gray-400 text-gray-400"
                        }`}
                        title="Checklist Albarán"
                      >
                        {item.num_albaran && <FaCheck className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>

                  {/* Factura */}
                  <td
                    onClick={() => handlePrint(item, "FACTURA")}
                    className={`cursor-pointer px-6 py-4 text-center ${
                      item.num_factura ? "text-blue-800" : ""
                    }`}
                  >
                    <div className="font-semibold text-gray-800">
                      {item.num_factura || "-"}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.datefactura &&
                        dayjs(item.datefactura).format("DD/MM/YYYY")}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vista móvil */}
      <div className="block md:hidden space-y-4">
        {sortedProducts.length === 0 ? (
          <div className="py-6 text-center text-gray-500 italic">
            No hay documentos registrados.
          </div>
        ) : (
          sortedProducts.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-lg shadow p-4 border ${
                item.observaciones?.toLowerCase().includes("anulado")
                  ? "bg-red-200 border-red-400"
                  : "bg-white border-gray-200"
              }`}
            >
              <p className="text-xs text-gray-500">Cliente</p>
              <p className="font-semibold text-gray-800">
                {item.clienteNombre || "-"}
              </p>

              <div className="mt-2">
                <p className="text-xs text-gray-500">Presupuesto</p>
                <p
                  onClick={() => handlePrint(item)}
                  className="font-semibold text-blue-800 cursor-pointer"
                >
                  {item.num_presupuesto || "-"}
                </p>
                <p className="text-xs text-gray-500">
                  {item.fecha_factura &&
                    dayjs(item.fecha_factura).format("DD/MM/YYYY")}
                </p>
                <div className="flex mt-1 space-x-2">
                  <button
                    onClick={() => toggleChecklistItem(item.id, "1")}
                    className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                      item.num_presupuesto
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-400 text-gray-400"
                    }`}
                  >
                    {item.num_presupuesto && <FaCheck className="w-3 h-3" />}
                  </button>

                  <button
                    onClick={() => handleUpdate(item)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEdit />
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-xs text-gray-500">Albarán</p>
                <p
                  onClick={() => handlePrint(item, "ALBARAN")}
                  className="font-semibold text-blue-800 cursor-pointer"
                >
                  {item.num_albaran || "-"}
                </p>
                <p className="text-xs text-gray-500">
                  {item.fecha_factalb &&
                    dayjs(item.fecha_factalb).format("DD/MM/YYYY")}
                </p>
                <div className="flex mt-1">
                  <button
                    onClick={() => toggleChecklistItem(item.id, "2")}
                    className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                      item.num_albaran
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "bg-white border-gray-400 text-gray-400"
                    }`}
                  >
                    {item.num_albaran && <FaCheck className="w-3 h-3" />}
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <p className="text-xs text-gray-500">Factura</p>
                <p
                  onClick={() => handlePrint(item, "FACTURA")}
                  className="font-semibold text-blue-800 cursor-pointer"
                >
                  {item.num_factura || "-"}
                </p>
                <p className="text-xs text-gray-500">
                  {item.datefactura &&
                    dayjs(item.datefactura).format("DD/MM/YYYY")}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
