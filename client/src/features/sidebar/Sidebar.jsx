import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { FaBars, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import useCompany from '@/hooks/company/useCompany';
// Importamos la configuración centralizada
import { MENU_ITEMS } from '@/constants/adminSidebar';

export const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  
  // Obtenemos datos de la empresa desde el hook
  const { empresas, loading } = useCompany(); 

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Bloquear scroll en móvil cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'auto';
  }, [isMobileMenuOpen]);

  // Fallback de datos de empresa
  const company = empresas && empresas.length > 0 ? empresas[0] : { name: 'Tapicería' };

  return (
    <>
      {/* Botón flotante móvil con Glassmorphism */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 text-white bg-slate-900/80 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/10 active:scale-95 transition-transform"
      >
        <FaBars size={20} />
      </button>

      <div className="flex h-screen w-full bg-[#F8FAFC]">
        {/* SIDEBAR ASIDE */}
        <aside
          className={`fixed top-0 left-0 flex flex-col h-screen z-40
            transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            ${isOpen ? 'w-72' : 'w-24'}
            bg-slate-900 text-white shadow-[10px_0_40px_rgba(0,0,0,0.04)]`}
        >
          {/* HEADER: LOGO Y NOMBRE */}
          <div className="relative flex items-center h-24 px-6 mb-4">
            <div className={`flex items-center gap-3 overflow-hidden transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 invisible'}`}>
              {loading ? (
                <div className="w-10 h-10 bg-slate-800 animate-pulse rounded-xl" />
              ) : company?.logo ? (
                <img src={company.logo} alt="Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg" />
              ) : (
                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <span className="font-black text-lg text-white">
                    {company?.name?.charAt(0)?.toUpperCase() || 'E'}
                  </span>
                </div>
              )}
              <h2 className="font-black text-lg tracking-tighter whitespace-nowrap">
                {loading ? 'Cargando...' : (company?.name || 'Empresa')}
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

          {/* MENÚ DE NAVEGACIÓN DINÁMICO */}
          <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
            <ul className="space-y-2">
              {MENU_ITEMS.map(({ label, path, href, icon: IconComponent, activeColor }) => {
                // Verificamos si la ruta está activa (solo para rutas internas)
                const isActive = path ? location.pathname === path : false;

                // RENDER PARA ENLACES EXTERNOS (Panel Control / Web)
                if (href) {
                  return (
                    <li key={label}>
                      <button
                        onClick={() => window.location.href = href}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-400 hover:bg-slate-800 hover:text-white transition-all duration-300 group"
                      >
                        <div className="group-hover:scale-110 transition-transform">
                          <IconComponent size={20} />
                        </div>
                        {isOpen && (
                          <span className="text-sm font-bold tracking-tight opacity-70 group-hover:opacity-100">
                            {label}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                }

                // RENDER PARA RUTAS INTERNAS (Clientes / Historial / Ajustes)
                return (
                  <li key={path}>
                    <Link
                      to={path}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group
                      ${isActive 
                        ? `${activeColor} text-white shadow-lg shadow-blue-500/20` 
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                    >
                      <div className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                        <IconComponent size={isActive ? 22 : 20} />
                      </div>

                      {isOpen && (
                        <span className="text-sm font-bold tracking-tight">
                          {label}
                        </span>
                      )}

                      {/* Indicador visual de página activa */}
                      {isActive && isOpen && (
                        <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"></div>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* FOOTER DE VERSIÓN */}
          <div className="p-6">
            <div className={`p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 transition-all duration-500 ${!isOpen && 'flex justify-center'}`}>
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

        {/* Overlay para móvil con desenfoque */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 md:hidden animate-in fade-in duration-300" 
            onClick={closeMobileMenu} 
          />
        )}

        {/* CONTENEDOR DE CONTENIDO PRINCIPAL */}
        <main 
          className={`flex-1 w-full min-h-screen transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
            ${isOpen ? 'md:ml-72' : 'md:ml-24'}`}
        >
          <div className="p-4 md:p-8 lg:p-12">
            {/* Aquí se inyectan las vistas de History, Clientes, etc. */}
            <Outlet /> 
          </div>
        </main>
      </div>
    </>
  );
};