import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// 1. Creamos el Contexto
const PagosContext = createContext();

// 2. Creamos un hook para usar el contexto
export const useApiPagosContext = () => {
  const context = useContext(PagosContext);
  if (!context) {
    throw new Error('useApiPagosContext debe usarse dentro de PagosProvider');
  }
  return context;
};

// 3. El Provider que carga los datos
export const PagosProvider = ({ children }) => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar todos los pagos desde la API
  const cargarPagos = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/pagos/');
      setPagos(res.data);
    } catch (err) {
      setError(err);
    }
  };

  // 🔹 Nueva función: traer pagos donde cliente_id === id
  const getPagosByClienteId = async (clienteId) => {
    try {
      const res = await axios.get(`http://localhost:8000/api/pagos/?cliente=${clienteId}`);
      console.log("res pagos: ", res)
      setPagos(res.data); // Actualizamos el estado local con los resultados
      return res.data; // Devolvemos los datos para usarlos en componentes
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  // Cargar datos al inicio
  useEffect(() => {
    cargarPagos().then(() => setLoading(false));
  }, []);

  const value = {
    pagos,
    loading,
    error,
    refetchclientes: cargarPagos,
    getPagosByClienteId, // 👈 Añadimos la nueva función al contexto
  };

  return (
    <PagosContext.Provider value={value}>
      {!loading ? children : <div>Cargando datos...</div>}
    </PagosContext.Provider>
  );
};