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

const feedbackService = {
  // Instructor endpoints for feedback
  getAllFeedbacks: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/feedbacks`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      throw error;
    }
  },

  getFeedbackById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/feedbacks/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching feedback with id ${id}:`, error);
      throw error;
    }
  },

  getFeedbacksBySessionId: async (sessionId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/feedbacks/session/${sessionId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching feedbacks for session ${sessionId}:`, error);
      throw error;
    }
  },

  getFeedbacksByCustomerId: async (customerId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/feedbacks/customer/${customerId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching feedbacks for customer ${customerId}:`, error);
      throw error;
    }
  },

  createFeedback: async (feedbackData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/feedbacks`, feedbackData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error creating feedback:', error);
      throw error;
    }
  },

  updateFeedback: async (id, feedbackData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/staff/feedbacks/${id}`, feedbackData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error updating feedback with id ${id}:`, error);
      throw error;
    }
  },

  deleteFeedback: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/staff/feedbacks/${id}`, getAuthHeaders());
      return true;
    } catch (error) {
      console.error(`Error deleting feedback with id ${id}:`, error);
      throw error;
    }
  },
  
  // Helper function to get rating display
  getRatingDisplay: (rating) => {
    switch(rating) {
      case 'POOR': return 'Poor';
      case 'FAIR': return 'Fair';
      case 'GOOD': return 'Good';
      case 'VERY_GOOD': return 'Very Good';
      case 'EXCELLENT': return 'Excellent';
      default: return rating;
    }
  },
  
  // Helper function to get rating value for display
  getRatingValue: (rating) => {
    switch(rating) {
      case 'POOR': return 1;
      case 'FAIR': return 2;
      case 'GOOD': return 3;
      case 'VERY_GOOD': return 4;
      case 'EXCELLENT': return 5;
      default: return 0;
    }
  },
  
  // Helper function to convert number to rating
  getRatingFromValue: (value) => {
    switch(value) {
      case 1: return 'POOR';
      case 2: return 'FAIR';
      case 3: return 'GOOD';
      case 4: return 'VERY_GOOD';
      case 5: return 'EXCELLENT';
      default: return null;
    }
  }
};

export default feedbackService;