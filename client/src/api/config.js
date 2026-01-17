import axios from 'axios';

// Obtenemos la URL del .env (que ahora Vite leerá de la raíz gracias a envDir: '../')
// Si por alguna razón no existe, usamos el fallback de Docker (10000)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

const api = axios.create({
    // Aseguramos que la URL termine en /api sin duplicar barras
    baseURL: `${baseURL.replace(/\/+$/, '')}`,
    headers: {
        'Content-Type': 'application/json',
    }
});

export default api;