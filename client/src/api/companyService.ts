import api from './config.js';

export const companyService = {
  /**
   * Obtiene los datos de la empresa.
   * Devuelve un array (generalmente con un único objeto de configuración).
   */
  async getCompanyData() {
    try {
      const response = await api.get('/api/companies/');
      return response.data;
    } catch (error) {
      console.error('Error fetching company data:', error);
      throw error;
    }
  },

  /**
   * Actualiza los datos de la empresa.
   * @param {string} cif - El identificador único de la empresa.
   * @param {FormData|Object} data - Los datos a actualizar. 
   * Si incluye imagen, debe ser FormData.
   */
  async updateCompanyData(cif, data) {
    try {
      const response = await api.patch(`/api/companies/${cif}/`, data);
      return response.data;
    } catch (error) {
      // Este log te ahorrará horas de depuración en el futuro
      if (error.response) {
        console.error('Error del Backend (Data):', error.response.data);
        console.error('Código de Error:', error.response.status);
      }
      throw error;
    }
  },

  /**
   * Crea un nuevo registro de empresa.
   * @param {FormData|Object} data 
   */
  async createCompanyData(data) {
    try {
      const response = await api.post('/api/companies/', data);
      return response.data;
    } catch (error) {
      console.error('Error creating company data:', error);
      throw error;
    }
  },
};