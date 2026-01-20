// src/hooks/useDataCompany.js

import { useApiDataDocumentsContext } from '../../../context/DataDocumentsProvider';

// Este es el hook que usas en tus componentes
const useDataDocuments = () => {
  const context = useApiDataDocumentsContext();

  if (!context) {
    throw new Error(
      'useDataDataDocuments debe usarse dentro de DataDataDocumentsProvider',
    );
  }

  return context;
};

export default useDataDocuments;
