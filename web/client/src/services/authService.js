import apiClient, { setAuthToken, clearAuth } from '@config/apiClient';
import { ENDPOINTS } from '@config/apiConfig';

export const authService = {
  // Login user
  async login(credentials) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Register new user
  async signup(userData) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await apiClient.get(ENDPOINTS.AUTH.PROFILE);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.CHANGE_PASSWORD, passwordData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Refresh token
  async refreshToken() {
    try {
      const response = await apiClient.post(ENDPOINTS.AUTH.REFRESH_TOKEN);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;