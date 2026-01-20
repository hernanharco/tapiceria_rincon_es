// src/hooks/useDataCompany.js

import { useApiTitleTableDocumentsContext } from '../../../context/TitleTableDocumentsProvider';

// Este es el hook que usas en tus componentes
const useTitleTableDocuments = () => {
  const context = useApiTitleTableDocumentsContext();

  if (!context) {
    throw new Error(
      'useDocuments debe usarse dentro de useTitleTableDocuments',
    );
  }

  return context;
};

export default useTitleTableDocuments;
