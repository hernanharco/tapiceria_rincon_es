import React, { useState } from 'react';
import {
  FaEdit,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaCheck,
  FaTrash,
  FaWhatsapp,
  FaEnvelope,
  FaTimes,
} from 'react-icons/fa';
import dayjs from 'dayjs';

// Importación del Servicio y Componentes
import { DocumentServicePDF } from '@/api/DocumentServicePDF';
import DateRangeFilter from '@/features/history/components/HistoryDateRangeFilter';
import { BulkSendModal } from '@/features/history/components/modal/BulkSendModal';

export const HistoryTableDocumentView = ({
  sortedProducts,
  setShowModal,
  isDisabled,
  handleUpdate,
  handleDeleteFactura,
  toggleChecklistItem,
  sortConfig,
  requestSort,
  handleFilter,
  handleClearFilter,
  loadingFilter,
}) => {
  // --- ESTADO PARA SELECCIÓN ---
  const [selectedIds, setSelectedIds] = useState([]);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState('whatsapp');

  // --- HANDLERS DE SELECCIÓN ---
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(sortedProducts.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const clearSelection = () => setSelectedIds([]);

  // --- HANDLER PARA EL MODAL (ACCIONES MASIVAS) ---
  const handleBulkConfirm = (options) => {
    // 1. Cambiamos 'documents' por 'sortedProducts', que es el nombre correcto en este componente
    const docsToProcess = sortedProducts.filter((doc) =>
      selectedIds.includes(doc.id),
    );

    if (bulkActionType === 'whatsapp') {
      // 2. Ejecutamos el envío por WhatsApp usando el servicio
      DocumentServicePDF.sendWhatsApp(docsToProcess, options);
    } else if (bulkActionType === 'email') {
      // Lógica para Email si la tienes implementada
      console.log('Enviando por email...', docsToProcess, options);
    }

    // 3. Cerramos el modal y limpiamos selección
    setIsBulkModalOpen(false);
    clearSelection();
  };

  // --- ESTILOS ---
  const btnBase =
    'p-2 rounded-full transition-all duration-200 transform hover:scale-125 inline-flex items-center justify-center';
  const editStyle = `${btnBase} text-blue-600 hover:bg-blue-300 hover:text-blue-900`;
  const deleteStyle = `${btnBase} text-red-500 hover:bg-red-300 hover:text-red-900`;
  const checkStyle = `${btnBase} hover:bg-yellow-300`;

  return (
    <>
      <DateRangeFilter
        onFilter={handleFilter}
        onClear={handleClearFilter}
        loading={loadingFilter}
      />

      {/* VISTA ESCRITORIO */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="min-w-full bg-white divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-4 text-center w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={
                    selectedIds.length === sortedProducts.length &&
                    sortedProducts.length > 0
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              {[
                { label: 'Cliente', key: 'clienteNombre' },
                { label: 'Presupuesto', key: 'num_presupuesto' },
                { label: 'Albarán', key: 'num_albaran' },
                { label: 'Factura', key: 'num_factura' },
              ].map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase cursor-pointer hover:bg-gray-200"
                  onClick={() => requestSort(col.key)}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span>{col.label}</span>
                    {sortConfig.key === col.key ? (
                      sortConfig.direction === 'asc' ? (
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
              <td colSpan={5} className="px-6 py-4 text-center">
                <button
                  onClick={() => setShowModal(true)}
                  disabled={isDisabled}
                  className={`px-4 py-2 rounded-md text-white font-medium transition-all ${
                    isDisabled
                      ? 'bg-gray-400'
                      : 'bg-green-600 hover:bg-green-700 hover:shadow-lg'
                  }`}
                >
                  Agregar Nuevo Documento
                </button>
              </td>
            </tr>

            {sortedProducts.map((item, idx) => {
              const isSelected = selectedIds.includes(item.id);
              const isAnulado = item.observaciones
                ?.toLowerCase()
                .includes('anulado');

              return (
                <tr
                  key={item.id || idx}
                  className={`transition-colors ${
                    isSelected
                      ? 'bg-blue-50'
                      : isAnulado
                        ? 'bg-red-200 hover:bg-red-300'
                        : 'hover:bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectOne(item.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>

                  <td
                    className="px-6 py-4 text-center text-gray-700 text-xs font-medium truncate max-w-[150px]"
                    title={item.clienteNombre}
                  >
                    {item.clienteNombre || '-'}
                  </td>

                  {/* COLUMNA PRESUPUESTO */}
                  <td className="px-6 py-4 text-center">
                    <div
                      onClick={() =>
                        DocumentServicePDF.print(item.num_presupuesto, 'PRE')
                      }
                      className="cursor-pointer font-bold text-blue-700 hover:text-blue-900 hover:underline transition-all"
                    >
                      {item.num_presupuesto || '-'}
                    </div>
                    <div className="text-xs text-gray-500 mb-2 font-mono">
                      {item.fecha_factura &&
                        dayjs(item.fecha_factura).format('DD/MM/YYYY')}
                    </div>
                    <div className="flex justify-center items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChecklistItem(item.id, '1');
                        }}
                        disabled={!!item.num_albaran}
                        className={`${checkStyle} ${item.num_albaran ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div
                          className={`w-7 h-7 flex items-center justify-center rounded-full border shadow-sm ${item.num_presupuesto ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-400 text-gray-400'}`}
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

                  {/* COLUMNA ALBARÁN */}
                  <td className="px-6 py-4 text-center">
                    <div
                      onClick={() =>
                        item.num_albaran &&
                        DocumentServicePDF.print(item.num_albaran, 'ALB')
                      }
                      className={`font-semibold transition-all ${item.num_albaran ? 'text-blue-700 cursor-pointer hover:underline' : 'text-gray-400'}`}
                    >
                      {item.num_albaran || '-'}
                    </div>
                    <div className="text-xs text-gray-500 mb-2 font-mono">
                      {item.fecha_factalb &&
                        dayjs(item.fecha_factalb).format('DD/MM/YYYY')}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleChecklistItem(item.id, '2');
                      }}
                      disabled={!!item.num_factura}
                      className={`${checkStyle} mt-1 ${item.num_factura ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div
                        className={`w-7 h-7 flex items-center justify-center rounded-full border ${item.num_albaran ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-400 text-gray-400'}`}
                      >
                        {item.num_albaran && <FaCheck className="w-3 h-3" />}
                      </div>
                    </button>
                  </td>

                  {/* COLUMNA FACTURA */}
                  <td className="px-6 py-4 text-center font-bold">
                    <div
                      onClick={() =>
                        item.num_factura &&
                        DocumentServicePDF.print(item.num_factura, 'FAC')
                      }
                      className={`${item.num_factura ? 'text-blue-800 cursor-pointer hover:underline' : 'text-gray-400'}`}
                    >
                      {item.num_factura || '-'}
                    </div>
                    <div className="text-xs text-gray-500 mb-2 font-mono">
                      {item.datefactura &&
                        dayjs(item.datefactura).format('DD/MM/YYYY')}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* VISTA MÓVIL OPTIMIZADA */}
      <div className="block md:hidden space-y-4 px-2 mb-24">
        <button
          onClick={() => setShowModal(true)}
          disabled={isDisabled}
          className={`w-full px-4 py-4 rounded-xl text-white font-bold shadow-lg transition-all active:scale-95 ${
            isDisabled ? 'bg-gray-400' : 'bg-green-600'
          }`}
        >
          + Agregar Nuevo Documento
        </button>

        {/* Barra de Selección Masiva para Móvil */}
        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="selectAllMobile"
              onChange={handleSelectAll}
              checked={
                selectedIds.length === sortedProducts.length &&
                sortedProducts.length > 0
              }
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="selectAllMobile"
              className="text-sm font-bold text-gray-700"
            >
              Seleccionar todos ({sortedProducts.length})
            </label>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={clearSelection}
              className="text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full"
            >
              Limpiar
            </button>
          )}
        </div>

        {sortedProducts.map((item, idx) => {
          const isSelected = selectedIds.includes(item.id);
          const isAnulado = item.observaciones
            ?.toLowerCase()
            .includes('anulado');

          return (
            <div
              key={item.id || idx}
              className={`relative rounded-2xl shadow-md border-2 transition-all overflow-hidden ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : isAnulado
                    ? 'border-red-200 bg-red-50'
                    : 'bg-white border-gray-100'
              }`}
            >
              {/* Selector Individual Flotante */}
              <div className="absolute top-3 right-3 z-10">
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleSelectOne(item.id)}
                  className="w-6 h-6 rounded-full border-gray-300 text-blue-600 shadow-sm"
                />
              </div>

              {/* Cabecera: Cliente */}
              <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                <p className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">
                  Cliente
                </p>
                <p className="font-bold text-gray-900 text-lg truncate pr-8">
                  {item.clienteNombre || 'Sin nombre'}
                </p>
              </div>

              {/* Grid de Documentos (PRE, ALB, FAC) */}
              <div className="p-4 grid grid-cols-3 gap-2 text-center">
                {/* Presupuesto */}
                <div
                  className={`p-2 rounded-xl border ${item.num_presupuesto ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}
                >
                  <p className="text-[9px] font-bold text-blue-800 uppercase">
                    Presu.
                  </p>
                  <button
                    onClick={() =>
                      item.num_presupuesto &&
                      DocumentServicePDF.print(item.num_presupuesto)
                    }
                    className="text-xs font-black block w-full truncate py-1 text-blue-700 active:underline"
                  >
                    {item.num_presupuesto || '-'}
                  </button>
                  <p className="text-[8px] text-gray-500 font-mono">
                    {item.fecha_factura
                      ? dayjs(item.fecha_factura).format('DD/MM/YY')
                      : '--/--'}
                  </p>
                </div>

                {/* Albarán */}
                <div
                  className={`p-2 rounded-xl border ${item.num_albaran ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}
                >
                  <p className="text-[9px] font-bold text-green-800 uppercase">
                    Albarán
                  </p>
                  <button
                    onClick={() =>
                      item.num_albaran &&
                      DocumentServicePDF.print(item.num_albaran)
                    }
                    className="text-xs font-black block w-full truncate py-1 text-green-700 active:underline"
                  >
                    {item.num_albaran || '-'}
                  </button>
                  <p className="text-[8px] text-gray-500 font-mono">
                    {item.fecha_factalb
                      ? dayjs(item.fecha_factalb).format('DD/MM/YY')
                      : '--/--'}
                  </p>
                </div>

                {/* Factura */}
                <div
                  className={`p-2 rounded-xl border ${item.num_factura ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}
                >
                  <p className="text-[9px] font-bold text-red-800 uppercase">
                    Factura
                  </p>
                  <button
                    onClick={() =>
                      item.num_factura &&
                      DocumentServicePDF.print(item.num_factura)
                    }
                    className="text-xs font-black block w-full truncate py-1 text-red-700 active:underline"
                  >
                    {item.num_factura || '-'}
                  </button>
                  <p className="text-[8px] text-gray-500 font-mono">
                    {item.datefactura
                      ? dayjs(item.datefactura).format('DD/MM/YY')
                      : '--/--'}
                  </p>
                </div>
              </div>

              {/* Acciones e Indicadores de Estado */}
              <div className="px-4 py-3 bg-gray-50 flex justify-between items-center border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(item)}
                    className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-200 text-blue-600 rounded-lg text-xs font-bold shadow-sm active:bg-blue-50"
                  >
                    <FaEdit /> Editar
                  </button>
                  <button
                    onClick={() => handleDeleteFactura(item)}
                    className="px-3 py-2 bg-white border border-gray-200 text-red-500 rounded-lg text-xs font-bold shadow-sm active:bg-red-50"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="flex gap-2">
                  {/* Convertir PRE a ALB */}
                  <button
                    onClick={() => toggleChecklistItem(item.id, '1')}
                    disabled={!!item.num_albaran}
                    className={`w-9 h-9 flex items-center justify-center rounded-full border shadow-sm transition-all ${
                      item.num_presupuesto
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    } ${item.num_albaran ? 'opacity-30' : 'active:scale-90'}`}
                  >
                    <FaCheck size={14} />
                  </button>
                  {/* Convertir ALB a FAC */}
                  <button
                    onClick={() => toggleChecklistItem(item.id, '2')}
                    disabled={!!item.num_factura}
                    className={`w-9 h-9 flex items-center justify-center rounded-full border shadow-sm transition-all ${
                      item.num_albaran
                        ? 'bg-green-600 border-green-600 text-white'
                        : 'bg-white border-gray-300 text-gray-400'
                    } ${item.num_factura ? 'opacity-30' : 'active:scale-90'}`}
                  >
                    <FaCheck size={14} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTION BAR FLOTANTE */}
      {selectedIds.length > 0 && (
        <>
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-white border border-gray-200 px-6 py-4 rounded-2xl shadow-xl z-[100] animate-in slide-in-from-bottom-4">
            <div className="flex flex-col">
              <span className="text-gray-900 font-bold">
                {selectedIds.length} seleccionados
              </span>
            </div>

            <div className="flex gap-4">
              {/* BOTÓN WHATSAPP */}
              <button
                onClick={() => {
                  setBulkActionType('whatsapp');
                  setIsBulkModalOpen(true);
                }}
                className="text-green-600 flex flex-col items-center hover:scale-110 transition-transform"
              >
                <FaWhatsapp size={22} />
                <span className="text-[9px] font-bold uppercase">WhatsApp</span>
              </button>

              {/* BOTÓN CORREO */}
              <button
                onClick={() => {
                  setBulkActionType('email');
                  setIsBulkModalOpen(true);
                }}
                className="text-blue-600 flex flex-col items-center hover:scale-110 transition-transform"
              >
                <FaEnvelope size={22} />
                <span className="text-[9px] font-bold uppercase">Correo</span>
              </button>
            </div>

            <button
              onClick={clearSelection}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <BulkSendModal
            isOpen={isBulkModalOpen}
            onClose={() => setIsBulkModalOpen(false)}
            selectedCount={selectedIds.length}
            actionType={bulkActionType}
            onConfirm={handleBulkConfirm} // Esta es la función que definimos arriba
          />
        </>
      )}
    </>
  );
};
