// src/constants/adminSidebar.js
import {
  FaHistory,
  FaUserFriends,
  FaCog,
  FaTools,
  FaGlobe,
} from 'react-icons/fa';

export const MENU_ITEMS = [
  { 
    label: 'Clientes', 
    path: '/clientes', 
    icon: FaUserFriends, 
    activeColor: 'bg-blue-600' 
  },
  { 
    label: 'Historial', 
    path: '/historial', 
    icon: FaHistory, 
    activeColor: 'bg-emerald-600' 
  },
  { 
    label: 'Ajustes', 
    path: '/settings', 
    icon: FaCog, 
    activeColor: 'bg-slate-700' 
  },
  { 
    label: 'Panel Control', 
    // 🔑 Nota: Usa guiones bajos (_) en lugar de guiones medios (-)
    href: import.meta.env.VITE_FRONTED_PANCONTROL || 'http://localhost:9002/admin', 
    icon: FaTools, 
    activeColor: 'bg-indigo-600' 
  },
  { 
    label: 'Página Web', 
    href: import.meta.env.VITE_FRONTED_WEB || 'http://localhost:3000', 
    icon: FaGlobe, 
    activeColor: 'bg-sky-600' 
  },
];