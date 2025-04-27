import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

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

const customerService = {
  // Admin endpoints for customer management
  getAllCustomers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/customers`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  },

  getCustomerById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/customers/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching customer with id ${id}:`, error);
      throw error;
    }
  }
};

export default customerService;