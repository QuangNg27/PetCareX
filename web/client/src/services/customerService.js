import apiClient from '@config/apiClient';
import { ENDPOINTS } from '@config/apiConfig';

export const customerService = {
  // Get customer profile
  async getProfile() {
    try {
      const response = await apiClient.get(ENDPOINTS.CUSTOMERS.PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get customer spending
  async getSpending() {
    try {
      const response = await apiClient.get(ENDPOINTS.CUSTOMERS.SPENDING);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get loyalty history
  async getLoyaltyHistory() {
    try {
      const response = await apiClient.get(ENDPOINTS.CUSTOMERS.LOYALTY_HISTORY);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update customer profile
  async updateProfile(profileData) {
    try {
      const response = await apiClient.put(ENDPOINTS.CUSTOMERS.PROFILE, profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update password
  async updatePassword(passwordData) {
    try {
      const response = await apiClient.post(ENDPOINTS.CUSTOMERS.UPDATE_PASSWORD, passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Search customers
  async searchCustomers(query) {
    try {
      const response = await apiClient.get(ENDPOINTS.CUSTOMERS.SEARCH, {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Pets management
  pets: {
    // Get all pets
    async getAll() {
      try {
        const response = await apiClient.get(ENDPOINTS.CUSTOMERS.PETS.LIST);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Create new pet
    async create(petData) {
      try {
        const response = await apiClient.post(ENDPOINTS.CUSTOMERS.PETS.CREATE, petData);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Get pet by ID
    async getById(petId) {
      try {
        const response = await apiClient.get(ENDPOINTS.CUSTOMERS.PETS.GET_BY_ID(petId));
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Update pet
    async update(petId, petData) {
      try {
        const response = await apiClient.put(ENDPOINTS.CUSTOMERS.PETS.UPDATE(petId), petData);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Delete pet
    async delete(petId) {
      try {
        const response = await apiClient.delete(ENDPOINTS.CUSTOMERS.PETS.DELETE(petId));
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Get pet medical history
    async getMedicalHistory(petId) {
      try {
        const response = await apiClient.get(ENDPOINTS.CUSTOMERS.PETS.MEDICAL_HISTORY(petId));
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    // Get pet vaccination history
    async getVaccinationHistory(petId) {
      try {
        const response = await apiClient.get(ENDPOINTS.CUSTOMERS.PETS.VACCINATION_HISTORY(petId));
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }
};

export default customerService;