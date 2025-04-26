import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// License type enum used in the application
export const LicenseType = {
  MOTORCYCLE: 'MOTORCYCLE',
  LIGHT_VEHICLE: 'LIGHT_VEHICLE',
  HEAVY_VEHICLE: 'HEAVY_VEHICLE'
};

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

// Headers configuration with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };
};

const trainingService = {
  // Admin endpoints (requires authentication)
  getAllProgramsAdmin: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/training-programs`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error fetching programs:', error);
      throw error;
    }
  },

  getProgramByIdAdmin: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/training-programs/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching program with id ${id}:`, error);
      throw error;
    }
  },

  createProgram: async (programData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/training-programs`, programData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error creating program:', error);
      throw error;
    }
  },

  updateProgram: async (id, programData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/staff/training-programs/${id}`, programData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error updating program with id ${id}:`, error);
      throw error;
    }
  },

  deleteProgram: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/staff/training-programs/${id}`, getAuthHeaders());
      return true;
    } catch (error) {
      console.error(`Error deleting program with id ${id}:`, error);
      throw error;
    }
  },

  // Public endpoints (no authentication required)
  getAllPrograms: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/training-programs`);
      return response.data;
    } catch (error) {
      console.error('Error fetching public programs:', error);
      throw error;
    }
  },

  getProgramById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/training-programs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching public program with id ${id}:`, error);
      throw error;
    }
  },
  
  // Helper functions for display
  getLicenseTypeDisplay: (type) => {
    switch(type) {
      case LicenseType.MOTORCYCLE: return 'Motorcycle';
      case LicenseType.LIGHT_VEHICLE: return 'Light Vehicle';
      case LicenseType.HEAVY_VEHICLE: return 'Heavy Vehicle';
      default: return type;
    }
  }
};

export default trainingService;