import React, { useState, useEffect, useRef } from 'react';
import { FaFileInvoiceDollar, FaTruck, FaReceipt, FaList, FaTimes } from 'react-icons/fa';

const documentTypes = [
  { value: 'Todos', label: 'Todos', shortLabel: 'Todo', icon: FaList },
  { value: 'Presupuesto', label: 'Presupuesto', shortLabel: 'Pres.', icon: FaFileInvoiceDollar },
  { value: 'Albarán', label: 'Albarán', shortLabel: 'Alb.', icon: FaTruck },
  { value: 'Factura', label: 'Factura', shortLabel: 'Fac.', icon: FaReceipt },
];

const DateRangeFilter = ({ onFilter, onClear, loading = false }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [documentType, setDocumentType] = useState('Todos');
  const debounceRef = useRef(null);
  const isFirstRender = useRef(true);

  // Ref para tener siempre la última versión de las funciones
  const onFilterRef = useRef(onFilter);
  const onClearRef = useRef(onClear);
  useEffect(() => { onFilterRef.current = onFilter; }, [onFilter]);
  useEffect(() => { onClearRef.current = onClear; }, [onClear]);

  // 🎯 AUTO-FILTRO: cada vez que el USUARIO cambia algo
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const hasFilters = (startDate && endDate) || documentType !== 'Todos';
    if (!hasFilters) {
      onClearRef.current();
      return;
    }

    debounceRef.current = setTimeout(() => {
      onFilterRef.current(startDate, endDate, documentType);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [startDate, endDate, documentType]);

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    setDocumentType('Todos');
  };

  const hasActiveFilters = (startDate && endDate) || documentType !== 'Todos';

  return (
    <div className="bg-slate-900 border-b border-slate-700 px-4 py-4 sm:px-6 shadow-xl rounded-t-xl">
      <div className="space-y-4">
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center">

          {/* Selector de Tipo */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 bg-slate-800/50 p-1.5 rounded-xl border border-slate-700">
            {documentTypes.map((type) => {
              const isActive = documentType === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setDocumentType(type.value)}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg scale-[1.02]' 
                      : 'text-slate-400 hover:bg-slate-700/50'
                  }`}
                  title={type.label}
                  aria-label={`Filtrar por ${type.label}`}
                  aria-pressed={isActive}
                >
                  <type.icon className="text-sm" aria-hidden="true" /> 
                  <span className="sm:hidden">{type.shortLabel}</span>
                  <span className="hidden sm:inline">{type.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Inputs de Fecha */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <div className="relative flex-1">
              <label htmlFor="filter-start-date" className="sr-only">Fecha inicio</label>
              <input
                id="filter-start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-3 pr-2 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
              />
            </div>
            <span className="hidden sm:block text-center text-slate-500 font-bold">al</span>
            <div className="relative flex-1">
              <label htmlFor="filter-end-date" className="sr-only">Fecha fin</label>
              <input
                id="filter-end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-3 pr-2 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Botón limpiar */}
          <div className="flex gap-2 lg:ml-auto">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="flex-1 lg:flex-none px-4 py-2.5 rounded-lg font-bold text-xs bg-slate-700 hover:bg-red-600/20 hover:text-red-400 text-white transition-all flex items-center justify-center gap-2"
                aria-label="Limpiar filtros"
              >
                <FaTimes aria-hidden="true" />
                <span className="sm:hidden">Limpiar</span>
              </button>
            )}
          </div>
        </div>

        {loading && (
          <div className="flex items-center gap-2 text-blue-400 text-xs animate-pulse">
            <div className="animate-spin h-3 w-3 border-2 border-blue-400 border-t-transparent rounded-full" />
            Actualizando resultados...
          </div>
        )}
      </div>
    </div>
  );
};

export default DateRangeFilter;
