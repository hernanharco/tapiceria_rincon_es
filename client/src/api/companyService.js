import api from './config.js';

export const companyService = {
  // Obtener todos los datos de la empresa
  async getCompanyData() {
    try {
      const response = await api.get('/api/companies/');
      return response.data;
    } catch (error) {
      console.error('Error fetching company data:', error);
      throw error;
    }
  },

  // Actualizar datos de la empresa
  async updateCompanyData(cif, data) {
    try {
      const response = await api.put(`/api/companies/${cif}/`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating company data:', error);
      throw error;
    }
  },

  // Crear nuevos datos de empresa
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
