import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom'; // Para mostrar contenido dinámico

// Iconos
import {
  FaHome,
  FaFileInvoice,
  FaFolderOpen,
  FaHistory,
  FaBox,
  FaUserFriends,
  FaCog,
  FaTimes,
  FaBars
} from 'react-icons/fa';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true); // true = abierto por defecto
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Botón para móvil */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 text-blue-600 bg-white p-2 rounded shadow-md"
        aria-label="Abrir menú"
      >
        <FaBars size={20} />
      </button>

      {/* Layout principal */}
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <div
          className={`sticky top-0 left-0 h-full z-40 flex flex-col transition-all duration-300 ease-in-out ${
            isOpen ? 'w-64' : 'w-16'
          } bg-gray-800 text-white`}
        >
          {/* Logo o título */}
          <div className={`flex items-center p-4 ${isOpen ? 'justify-between' : 'justify-center'}`}>
            {isOpen && <h2 className="font-semibold">Tapicería El Rincón</h2>}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded hover:bg-gray-700"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>

          {/* Menú */}
          <nav className="flex-1 p-4 space-y-2">
            <ul>
              {/* Inicio */}
              <li className={`p-2 rounded ${isOpen ? 'hover:bg-gray-700' : 'text-center'}`}>
                <Link to="/inicio" className={`flex items-center ${!isOpen ? 'justify-center' : ''}`}>
                  <span><FaHome /></span>
                  {isOpen && <span className="ml-3">Inicio</span>}
                </Link>
              </li>              

              {/* Historial */}
              <li className={`p-2 rounded ${isOpen ? 'hover:bg-gray-700' : 'text-center'}`}>
                <Link to="/historial" className={`flex items-center ${!isOpen ? 'justify-center' : ''}`}>
                  <span><FaHistory /></span>
                  {isOpen && <span className="ml-3">Historial</span>}
                </Link>
              </li>              

              {/* Clientes */}
              <li className={`p-2 rounded ${isOpen ? 'hover:bg-gray-700' : 'text-center'}`}>
                <Link to="/clientes" className={`flex items-center ${!isOpen ? 'justify-center' : ''}`}>
                  <span><FaUserFriends /></span>
                  {isOpen && <span className="ml-3">Clientes</span>}
                </Link>
              </li>

              {/* Ajustes */}
              <li className={`p-2 rounded ${isOpen ? 'hover:bg-gray-700' : 'text-center'}`}>
                <Link to="/ajustes" className={`flex items-center ${!isOpen ? 'justify-center' : ''}`}>
                  <span><FaCog /></span>
                  {isOpen && <span className="ml-3">Ajustes</span>}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Footer o versión */}
          <div className={`p-4 text-xs text-gray-400 ${!isOpen && 'text-center'}`}>
            {isOpen ? 'Versión 1.0.0' : 'v1'}
          </div>
        </div>

        {/* Fondo oscuro en móvil cuando se abre el sidebar */}
        {isMobileMenuOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={closeMobileMenu}
          ></div>
        )}

        {/* Contenido principal */}
        <main
          className={`${isOpen ? 'md:ml-1' : 'md:ml-5'} w-full min-h-screen transition-all duration-300 relative overflow-y-auto`}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
}