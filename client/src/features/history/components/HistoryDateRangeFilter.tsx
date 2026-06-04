import React, { useState } from 'react';
import { FaCalendarAlt, FaFilter, FaTimes, FaFileInvoice, FaFileAlt, FaReceipt } from 'react-icons/fa';

const DateRangeFilter = ({ onFilter, onClear, loading = false }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [documentType, setDocumentType] = useState('Todos');

  const canFilter = (startDate !== '' && endDate !== '') || documentType !== 'Todos';

  const documentTypes = [
    { value: 'Todos', label: 'Todos', icon: FaFilter },
    { value: 'Presupuesto', label: 'Pres.', icon: FaFileInvoice }, // Label corto para móvil
    { value: 'Albarán', label: 'Alb.', icon: FaFileAlt },
    { value: 'Factura', label: 'Fac.', icon: FaReceipt },
  ];

  const handleFilter = (e) => {
    if (e) e.preventDefault();
    if (!canFilter) return;
    onFilter(startDate, endDate, documentType);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setDocumentType('Todos');
    onClear();
  };

  return (
    <div className="bg-slate-900 border-b border-slate-700 px-4 py-4 sm:px-6 shadow-xl rounded-t-xl">
      <form onSubmit={handleFilter} className="space-y-4">
        {/* Contenedor Principal Adaptativo */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
          
          {/* Selector de Tipo: Grid 2x2 en móviles, flex en escritorio */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700">
            {documentTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setDocumentType(type.value)}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  documentType === type.value 
                    ? 'bg-blue-600 text-white shadow-lg scale-[1.02]' 
                    : 'text-slate-400 hover:bg-slate-700/50'
                }`}
              >
                <type.icon className="text-sm" /> 
                <span className="hidden xs:inline">{type.label}</span>
                <span className="xs:hidden">{type.label}</span>
              </button>
            ))}
          </div>

          {/* Inputs de Fecha: Dos columnas en móvil */}
          <div className="grid grid-cols-1 sm:flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-3 pr-2 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
              />
            </div>
            <span className="hidden sm:block text-slate-500 font-bold">al</span>
            <div className="relative flex-1">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-3 pr-2 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Botones de Acción: Ancho completo en móvil */}
          <div className="flex gap-2 lg:ml-auto">
            <button
              type="submit"
              disabled={loading || !canFilter}
              className={`flex-1 lg:flex-none px-8 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all ${
                canFilter && !loading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg active:scale-95'
                  : 'bg-slate-800 text-slate-600 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"/>
              ) : (
                <FaFilter />
              )}
              <span>Filtrar</span>
            </button>
            
            <button
              type="button"
              onClick={handleClear}
              className={`px-5 py-2.5 rounded-lg font-bold transition-all ${
                canFilter 
                  ? 'bg-slate-700 hover:bg-red-600/20 hover:text-red-400 text-white' 
                  : 'bg-slate-800 text-slate-700 pointer-events-none'
              }`}
              title="Limpiar filtros"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DateRangeFilter;