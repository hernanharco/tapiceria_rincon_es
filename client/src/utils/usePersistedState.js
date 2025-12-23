// hooks/usePersistedState.js
import { useState, useEffect } from 'react';

export const usePersistedState = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error al leer ${key} de localStorage`, error);
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error al guardar ${key} en localStorage`, error);
    }
  }, [key, value]);

  return [value, setValue];
};