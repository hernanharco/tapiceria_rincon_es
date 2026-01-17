// src/hooks/useDataCompany.js

import { useApiFootersContext } from '../../../context/FootersProvider';

// Este es el hook que usas en tus componentes
const useFooters = () => {
  const context = useApiFootersContext();

  if (!context) {
    throw new Error('useClients debe usarse dentro de FootersProvider');
  }

  return context;
};

export default useFooters;
