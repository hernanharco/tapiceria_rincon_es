import { createContext, useContext, useState, useEffect } from "react";
import api from '@/api/config';

const CompanyContext = createContext();

export const useApiCompanyContext = () => {
  const context = useContext(CompanyContext);
  if (!context) {
    throw new Error("useApiCompanyContext debe usarse dentro de CompanyProvider");
  }
  return context;
};

export const CompanyProvider = ({ children }) => {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * ACCIÓN: Obtener datos (Read)
   */
  const cargarEmpresas = async () => {
    try {
      const res = await api.get(`/api/companies/`);
      setEmpresas(res.data);
      return res.data;
    } catch (err) {
      console.error('Error fetching company data:', err);
      setError(err);
    }
  };

  /**
   * ACCIÓN: Actualizar datos (Update/Patch)
   */
  const actualizarEmpresa = async (cif, data) => {
    try {
      const response = await api.patch(`/api/companies/${cif}/`, data);
      
      // Sincronización automática: recargamos los datos en el estado global
      await cargarEmpresas(); 
      
      return response.data;
    } catch (error) {
      if (error.response) {
        console.error('Error del Backend (Data):', error.response.data);
        console.error('Código de Error:', error.response.status);
      }
      throw error;
    }
  };

  /**
   * ACCIÓN: Crear registro (Create)
   */
  const crearEmpresa = async (data) => {
    try {
      const response = await api.post('/api/companies/', data);
      await cargarEmpresas();
      return response.data;
    } catch (error) {
      console.error('Error creating company data:', error);
      throw error;
    }
  };

  // Carga inicial
  useEffect(() => {
    cargarEmpresas().finally(() => setLoading(false));
  }, []);

  const value = {
    empresas,
    loading,
    error,
    actualizarEmpresa,
    crearEmpresa,
    refetchEmpresas: cargarEmpresas,
  };

  return (
    <CompanyContext.Provider value={value}>
      {!loading ? children : (
        <div className="flex h-screen items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </CompanyContext.Provider>
  );
};