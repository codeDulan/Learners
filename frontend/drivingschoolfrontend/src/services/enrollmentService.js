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

const enrollmentService = {
  // Admin endpoints for enrollments
  getAllEnrollments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/enrollments`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }
  },

  createEnrollment: async (enrollmentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/enrollments`, enrollmentData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error creating enrollment:', error);
      throw error;
    }
  },

  updateEnrollment: async (id, enrollmentData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/staff/enrollments/${id}`, enrollmentData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error updating enrollment with id ${id}:`, error);
      throw error;
    }
  },

  deleteEnrollment: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/staff/enrollments/${id}`, getAuthHeaders());
      return true;
    } catch (error) {
      console.error(`Error deleting enrollment with id ${id}:`, error);
      throw error;
    }
  },
  
  // Helper function to get status display name
  getStatusDisplay: (status) => {
    switch(status) {
      case 'PENDING': return 'Pending';
      case 'ACTIVE': return 'Active';
      case 'COMPLETED': return 'Completed';
      case 'CANCELLED': return 'Cancelled';
      default: return status;
    }
  }
};

export default enrollmentService;