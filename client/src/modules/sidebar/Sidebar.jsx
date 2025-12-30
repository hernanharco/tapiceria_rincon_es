import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom"; // Importamos useLocation para el estado activo
import { FaHistory, FaUserFriends, FaCog, FaBars, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const MENU_ITEMS = [
  { label: "Clientes", path: "/clientes", icon: FaUserFriends, activeColor: "bg-blue-600" },
  { label: "Historial", path: "/historial", icon: FaHistory, activeColor: "bg-emerald-600" },  
  { label: "Ajustes", path: "/settings", icon: FaCog, activeColor: "bg-slate-700" },
];

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation(); // Para saber en qué página estamos

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? "hidden" : "auto";
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Botón flotante móvil con Glassmorphism */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/10"
      >
        <FaBars size={20} />
      </button>

      <div className="flex h-screen w-full bg-[#F8FAFC]">
        {/* Sidebar Estilizado */}
        <aside
          className={`fixed top-0 left-0 flex flex-col h-screen z-40
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            ${isOpen ? "w-72" : "w-24"}
            bg-slate-900 text-white shadow-[10px_0_40px_rgba(0,0,0,0.04)]`}
        >
          {/* LOGO / HEADER */}
          <div className="relative flex items-center h-24 px-6 mb-4">
            <div className={`flex items-center gap-3 overflow-hidden transition-all duration-500 ${isOpen ? "opacity-100" : "opacity-0 invisible"}`}>
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <span className="font-black text-lg">TR</span>
              </div>
              <h2 className="font-black text-lg tracking-tighter whitespace-nowrap">
                Tapicería <span className="text-blue-500">Rincón</span>
              </h2>
            </div>

            {/* Botón de Colapso (Solo Desktop) */}
            <button
              onClick={toggleSidebar}
              className="hidden md:flex absolute -right-4 top-10 w-8 h-8 bg-white border border-slate-100 rounded-full items-center justify-center text-slate-400 hover:text-blue-600 shadow-md transition-all active:scale-90 z-50"
            >
              {isOpen ? <FaChevronLeft size={12} /> : <FaChevronRight size={12} />}
            </button>
          </div>

          {/* MENÚ DE NAVEGACIÓN */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            <ul className="space-y-2">
              {MENU_ITEMS.map(({ label, path, icon: IconComponent, activeColor }) => {
                const isActive = location.pathname === path;
                
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group
                        ${isActive 
                          ? `${activeColor} text-white shadow-lg shadow-blue-500/20` 
                          : "text-slate-400 hover:bg-slate-800 hover:text-white"
                        }`}
                    >
                      <div className={`transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                        <IconComponent size={isActive ? 22 : 20} />
                      </div>
                      
                      {isOpen && (
                        <span className={`text-sm font-bold tracking-tight transition-all duration-300 ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                          {label}
                        </span>
                      )}

                      {/* Indicador visual activo (punto) */}
                      {isActive && isOpen && (
                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_white]"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* FOOTER PREMIUM */}
          <div className="p-6">
            <div className={`p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 transition-all duration-500 ${!isOpen && "items-center justify-center flex"}`}>
              {isOpen ? (
                <div className="flex flex-col gap-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Desarrollado por</p>
                  <p className="text-xs font-bold text-slate-300">v1.5.0 - hernan.harco</p>
                </div>
              ) : (
                <span className="text-[10px] font-black text-slate-500">v1.5</span>
              )}
            </div>
          </div>
        </aside>

        {/* Overlay con Blur */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-300"
            onClick={closeMobileMenu}
          />
        )}

        {/* CONTENIDO PRINCIPAL (Donde está tu tabla) */}
        <main
          className={`flex-1 w-full min-h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isOpen ? "md:ml-72" : "md:ml-24"}`}
        >
          {/* Añadimos un contenedor interno para que el contenido no pegue a los bordes */}
          <div className="p-4 md:p-8 lg:p-12">
             <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};