// @ts-expect-error - axios has no types installed
import axios from 'axios';

const rawBaseURL = import.meta.env.VITE_API_URL || 'http://localhost:10000';
const cleanBaseURL = rawBaseURL.replace(/\/+$/, '');

export const api = axios.create({
  baseURL: cleanBaseURL,
});

// Interceptor: adjuntar token JWT de authCore si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: si el token expiró, redirigir al login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
