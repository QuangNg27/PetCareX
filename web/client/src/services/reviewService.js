import apiClient from '@config/apiClient';
import { ENDPOINTS } from '@config/apiConfig';

export const reviewService = {
  // Get my reviews
  async getMyReviews() {
    try {
      const response = await apiClient.get(ENDPOINTS.REVIEWS.MY_REVIEWS);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all reviews
  async getAllReviews() {
    try {
      const response = await apiClient.get(ENDPOINTS.REVIEWS.LIST);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get recent reviews
  async getRecentReviews() {
    try {
      const response = await apiClient.get(ENDPOINTS.REVIEWS.RECENT);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create review
  async create(reviewData) {
    try {
      const response = await apiClient.post(ENDPOINTS.REVIEWS.CREATE, reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get review by ID
  async getById(reviewId) {
    try {
      const response = await apiClient.get(ENDPOINTS.REVIEWS.GET_BY_ID(reviewId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update review
  async update(reviewId, reviewData) {
    try {
      const response = await apiClient.put(ENDPOINTS.REVIEWS.UPDATE(reviewId), reviewData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete review
  async delete(reviewId) {
    try {
      const response = await apiClient.delete(ENDPOINTS.REVIEWS.DELETE(reviewId));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default reviewService;
