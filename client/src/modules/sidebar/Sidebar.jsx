import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Outlet } from "react-router-dom";
import {
  FaHistory,
  FaUserFriends,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Bloquear scroll del body en móvil cuando el menú esté abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isMobileMenuOpen]);

  // Variables para swipe (opcional)
  let touchStartX = 0;

  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    const touchEndX = e.touches[0].clientX;
    if (touchStartX - touchEndX > 50) {
      closeMobileMenu();
    }
  };

  return (
    <>
      {/* Botón hamburguesa móvil */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-orange-600 p-2 rounded-lg shadow-md"
        aria-label="Abrir menú lateral"
      >
        <FaBars size={20} />
      </button>

      <div className="flex h-screen w-full bg-gray-100">
        {/* Sidebar */}
        <aside
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className={`fixed top-0 left-0 flex flex-col h-screen z-40
          transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${isOpen ? "w-64" : "w-20"} bg-[#8B5E3C] text-white shadow-lg`}
        >
          {/* Logo / título */}
          <div
            className={`flex items-center p-4 ${
              isOpen ? "justify-between" : "justify-center"
            } border-b border-[#7A4E2C]`}
          >
            {isOpen && (
              <h2 className="font-bold text-xl tracking-wide hidden md:block">
                Tapicería Rincon
              </h2>
            )}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-[#7A4E2C] transition-colors"
              aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isOpen ? (
                <FaTimes size={18} className="text-orange-400" />
              ) : (
                <FaBars size={18} className="text-orange-400" />
              )}
            </button>
          </div>

          {/* Menú */}
          <nav className="flex-1 p-4 space-y-3 overflow-y-auto">
            <ul>
              <li
                className={`p-2 rounded-lg transition-colors hover:bg-[#A6784F] ${
                  !isOpen && "text-center"
                }`}
              >
                <Link
                  to="/historial"
                  className={`flex items-center gap-3 ${
                    !isOpen && "justify-center"
                  }`}
                  onClick={closeMobileMenu}
                >
                  <FaHistory size={20} className="text-red-400" />
                  {isOpen && (
                    <span className="text-md font-medium">Historial</span>
                  )}
                </Link>
              </li>
              <li
                className={`p-2 rounded-lg transition-colors hover:bg-[#A6784F] ${
                  !isOpen && "text-center"
                }`}
              >
                <Link
                  to="/clientes"
                  className={`flex items-center gap-3 ${
                    !isOpen && "justify-center"
                  }`}
                  onClick={closeMobileMenu}
                >
                  <FaUserFriends size={20} className="text-green-400" />
                  {isOpen && (
                    <span className="text-md font-medium">Clientes</span>
                  )}
                </Link>
              </li>
              <li
                className={`p-2 rounded-lg transition-colors hover:bg-[#A6784F] ${
                  !isOpen && "text-center"
                }`}
              >
                <Link
                  to="/settings"
                  className={`flex items-center gap-3 ${
                    !isOpen && "justify-center"
                  }`}
                  onClick={closeMobileMenu}
                >
                  <FaCog size={20} className="text-blue-400" />
                  {isOpen && (
                    <span className="text-md font-medium">Ajustes</span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div
            className={`p-4 text-xs text-gray-200 ${!isOpen && "text-center"}`}
          >
            {isOpen ? "v1.0.0 - hernan.harco" : "v1"}
          </div>
        </aside>

        {/* Overlay para móvil */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
            onClick={closeMobileMenu}
          ></div>
        )}

        {/* Contenido principal */}
        <main
          className={`flex-1 w-full min-h-screen p-4 md:p-6 transition-all duration-300 relative
                        ${isOpen ? "md:ml-64" : "md:ml-20"}`}
        >
          <Outlet />
        </main>
      </div>
    </>
  );
};
