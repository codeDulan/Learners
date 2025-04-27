import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Payment method enum used in the application
export const PaymentMethod = {
  CASH: 'CASH',
  CARD: 'CARD',
  BANK_TRANSFER: 'BANK_TRANSFER',
  MOBILE_PAYMENT: 'MOBILE_PAYMENT'
};

// Payment status enum used in the application
export const PaymentStatus = {
  COMPLETED: 'COMPLETED',
  PENDING: 'PENDING',
  CANCELLED: 'CANCELLED'
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

const paymentService = {
  // Admin endpoints for payment management
  getAllPayments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/payments`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw error;
    }
  },

  getPaymentById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/payments/${id}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching payment with id ${id}:`, error);
      throw error;
    }
  },

  getPaymentsByEnrollmentId: async (enrollmentId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/payments/enrollment/${enrollmentId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for enrollment ${enrollmentId}:`, error);
      throw error;
    }
  },

  getPaymentsByCustomerId: async (customerId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/staff/payments/customer/${customerId}`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error fetching payments for customer ${customerId}:`, error);
      throw error;
    }
  },

  createPayment: async (paymentData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/staff/payments`, paymentData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error creating payment:', error);
      throw error;
    }
  },

  updatePayment: async (id, paymentData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/staff/payments/${id}`, paymentData, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error(`Error updating payment with id ${id}:`, error);
      throw error;
    }
  },

  deletePayment: async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/staff/payments/${id}`, getAuthHeaders());
      return true;
    } catch (error) {
      console.error(`Error deleting payment with id ${id}:`, error);
      throw error;
    }
  },

  // Customer endpoints for viewing their own payments
  getMyPayments: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/customer/payments`, getAuthHeaders());
      return response.data;
    } catch (error) {
      console.error('Error fetching my payments:', error);
      throw error;
    }
  },

  // Helper functions for display
  getPaymentMethodDisplay: (method) => {
    switch(method) {
      case PaymentMethod.CASH: return 'Cash';
      case PaymentMethod.CARD: return 'Card';
      case PaymentMethod.BANK_TRANSFER: return 'Bank Transfer';
      case PaymentMethod.MOBILE_PAYMENT: return 'Mobile Payment';
      default: return method;
    }
  },

  getStatusDisplay: (status) => {
    switch(status) {
      case PaymentStatus.COMPLETED: return 'Completed';
      case PaymentStatus.PENDING: return 'Pending';
      case PaymentStatus.CANCELLED: return 'Cancelled';
      default: return status;
    }
  },

  getStatusColor: (status) => {
    switch(status) {
      case PaymentStatus.COMPLETED: return '#4cceac'; // green
      case PaymentStatus.PENDING: return '#6870fa'; // blue
      case PaymentStatus.CANCELLED: return '#ff5e5e'; // red
      default: return '#777777'; // gray
    }
  },

  // Format currency for display
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }
};

export default paymentService;