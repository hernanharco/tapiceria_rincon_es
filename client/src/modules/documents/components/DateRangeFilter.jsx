import React, { useState } from 'react';
import { FaCalendarAlt, FaFilter, FaTimes } from 'react-icons/fa';
import dayjs from 'dayjs';

const DateRangeFilter = ({ onFilter, onClear, loading = false }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    if (!startDate || !endDate) {
      alert('Por favor, selecciona ambas fechas');
      return;
    }

    if (dayjs(startDate).isAfter(dayjs(endDate))) {
      alert('La fecha de inicio no puede ser posterior a la fecha de fin');
      return;
    }

    onFilter(startDate, endDate);
  };

  const handleClear = () => {
    setStartDate('');
    setEndDate('');
    onClear();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleFilter();
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Título del Filtro */}
        <div className="flex items-center gap-2 text-gray-700 font-medium">
          <FaFilter className="text-blue-600" />
          <span className="text-sm font-semibold">Filtrar por Fechas</span>
        </div>

        {/* Contenedor de Fechas */}
        <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
          {/* Fecha Inicio */}
          <div className="relative flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400 text-sm" />
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Fecha inicio"
                max={endDate || dayjs().format('YYYY-MM-DD')}
              />
              {startDate && (
                <button
                  onClick={() => setStartDate('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Limpiar fecha inicio"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
          </div>

          {/* Separador */}
          <span className="text-gray-400 text-sm font-medium">hasta</span>

          {/* Fecha Fin */}
          <div className="relative flex items-center gap-2">
            <FaCalendarAlt className="text-gray-400 text-sm" />
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Fecha fin"
                min={startDate}
                max={dayjs().format('YYYY-MM-DD')}
              />
              {endDate && (
                <button
                  onClick={() => setEndDate('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Limpiar fecha fin"
                >
                  <FaTimes className="text-xs" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-2">
          <button
            onClick={handleFilter}
            disabled={loading || !startDate || !endDate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 min-w-[100px] justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Filtrando...
              </>
            ) : (
              <>
                <FaFilter className="text-xs" />
                Filtrar
              </>
            )}
          </button>

          <button
            onClick={handleClear}
            disabled={loading}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <FaTimes className="text-xs" />
            Limpiar
          </button>
        </div>
      </div>

      {/* Información de Rango Activo */}
      {startDate && endDate && (
        <div className="mt-3 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
          <FaCalendarAlt className="text-blue-500" />
          <span>
            Mostrando documentos del{' '}
            <strong>{dayjs(startDate).format('DD [de] MMMM [de] YYYY')}</strong>{' '}
            al{' '}
            <strong>{dayjs(endDate).format('DD [de] MMMM [de] YYYY')}</strong>
          </span>
        </div>
      )}
    </div>
  );
};

export default DateRangeFilter;
