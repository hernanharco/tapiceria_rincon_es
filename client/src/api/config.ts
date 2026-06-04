import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:10000';
// Solo quitamos las barras inclinadas del final, NO agregamos /api
const cleanBaseURL = rawBaseURL.replace(/\/+$/, '');

const api = axios.create({
  baseURL: cleanBaseURL, 
//   headers: {
//     'ngrok-skip-browser-warning': 'true',
//     'Accept': 'application/json',
//     'Content-Type': 'application/json'
//   }
});

export default api;