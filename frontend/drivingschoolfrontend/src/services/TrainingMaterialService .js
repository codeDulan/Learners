import axios from 'axios';

class TrainingMaterialService {
  // Base URL for API calls - change this to match your backend URL
  API_BASE_URL = 'http://localhost:8080';
  
  // Get auth token
  getAuthToken() {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  }

  // Admin: Get all training materials
  async getAllMaterials() {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/api/staff/training-materials`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Admin: Get a specific training material by ID
  async getMaterialById(id) {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/api/staff/training-materials/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Admin: Upload a new training material
  async uploadMaterial(materialData, file) {
    try {
      const formData = new FormData();
      
      // Create a JSON blob for the material metadata
      const materialBlob = new Blob(
        [JSON.stringify(materialData)], 
        { type: 'application/json' }
      );
      
      // Append the material metadata and file to the FormData
      formData.append('material', materialBlob);
      formData.append('file', file);
      
      const response = await axios.post(
        `${this.API_BASE_URL}/api/staff/training-materials`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.getAuthToken()}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Admin: Update an existing training material
  async updateMaterial(id, materialData) {
    try {
      const response = await axios.put(
        `${this.API_BASE_URL}/api/staff/training-materials/${id}`,
        materialData,
        {
          headers: {
            'Authorization': `Bearer ${this.getAuthToken()}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Admin: Delete a training material
  async deleteMaterial(id) {
    try {
      await axios.delete(`${this.API_BASE_URL}/api/staff/training-materials/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`
        }
      });
      return true;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Admin: Download a training material
  async downloadMaterial(id) {
    try {
      const response = await axios.get(
        `${this.API_BASE_URL}/api/staff/training-materials/${id}/download`,
        {
          headers: {
            'Authorization': `Bearer ${this.getAuthToken()}`
          },
          responseType: 'blob' // Important for file download
        }
      );
      
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  // Helper method to handle errors
  handleError(error) {
    // Log the error for debugging
    console.error('TrainingMaterialService Error:', error);
    
    // Handle specific error cases
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response:', error.response.data);
      
      // Check for auth errors
      if (error.response.status === 401 || error.response.status === 403) {
        // Redirect to login or show auth error
        console.error('Authentication error');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
  }
}

export default new TrainingMaterialService();