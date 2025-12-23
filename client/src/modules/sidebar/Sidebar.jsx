import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

// Iconos
import {
  FaHome,
  FaFileInvoice,
  FaHistory,
  FaUserFriends,
  FaCog,
  FaBars,
  FaTimes,
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
      {/* Botón hamburguesa - solo en móvil */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 text-blue-600 bg-white p-2 rounded shadow-md no-print"
        aria-label="Abrir menú lateral"
      >
        <FaBars size={20} />
      </button>

      {/* Layout principal */}
      <div className="flex h-screen w-full">
        {/* Sidebar */}
        <aside
          className={`fixed md:relative flex flex-col h-full z-40 transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          } md:translate-x-0 transform ${
            isOpen ? 'w-64' : 'w-16'
          } bg-gray-800 text-white`}
        >
          {/* Logo / Título */}
          <div
            className={`flex items-center p-4 ${
              isOpen ? 'justify-between' : 'justify-center'
            } border-b border-gray-700`}
          >
            {isOpen && <h2 className="font-semibold hidden md:block">Tapicería</h2>}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded hover:bg-gray-700"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
            </button>
          </div>

          {/* Menú */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <ul>
              {/* Inicio
              <li className={`p-2 rounded ${isOpen ? 'hover:bg-gray-700' : 'text-center'}`}>
                <Link to="/imprimir" className={`flex items-center ${!isOpen ? 'justify-center' : ''}`} onClick={closeMobileMenu}>
                  <span><FaHome /></span>
                  {isOpen && <span className="ml-3">Inicio</span>}
                </Link>
              </li> */}

              {/* Historial */}
              <li className={`p-2 rounded ${isOpen ? 'hover:bg-gray-700' : 'text-center'}`}>
                <Link to="/historial" className={`flex items-center ${!isOpen ? 'justify-center' : ''}`} onClick={closeMobileMenu}>
                  <span><FaHistory /></span>
                  {isOpen && <span className="ml-3">Historial</span>}
                </Link>
              </li>

              {/* Clientes */}
              <li className={`p-2 rounded ${isOpen ? 'hover:bg-gray-700' : 'text-center'}`}>
                <Link to="/clientes" className={`flex items-center ${!isOpen ? 'justify-center' : ''}`} onClick={closeMobileMenu}>
                  <span><FaUserFriends /></span>
                  {isOpen && <span className="ml-3">Clientes</span>}
                </Link>
              </li>

              {/* Ajustes */}
              <li className={`p-2 rounded ${isOpen ? 'hover:bg-gray-700' : 'text-center'}`}>
                <Link to="/settings" className={`flex items-center ${!isOpen ? 'justify-center' : ''}`} onClick={closeMobileMenu}>
                  <span><FaCog /></span>
                  {isOpen && <span className="ml-3">Ajustes</span>}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className={`p-4 text-xs text-gray-400 ${!isOpen && 'text-center'}`}>
            {isOpen ? 'Versión 1.0.0 - hernan.harco' : 'v1'}
          </div>
        </aside>

        {/* Overlay para móvil */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
            onClick={closeMobileMenu}
          ></div>
        )}

        {/* Contenido principal - Bien centrado */}
        <main
          className={`${
            isOpen ? 'max-w-full mx-auto' : 'max-w-full mx-auto'
          } w-full min-h-screen bg-gray-100 p-4 md:p-6 overflow-x-hidden transition-all duration-300 relative`}
        >
          <div className="max-w-full mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};