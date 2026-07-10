// src/constants/adminSidebar.js
import {
  FaHistory,
  FaUserFriends,
  FaCog,
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
];