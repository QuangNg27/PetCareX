import apiClient from '@config/apiClient';
import { ENDPOINTS } from '@config/apiConfig';

export const serviceService = {
  // Get services by branch
  async getByBranch(branchId) {
    try {
      const response = await apiClient.get(ENDPOINTS.SERVICES.BY_BRANCH(branchId));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Examinations
  examinations: {
    async getAll() {
      try {
        const response = await apiClient.get(ENDPOINTS.SERVICES.EXAMINATIONS.LIST);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async create(examData) {
      try {
        const response = await apiClient.post(ENDPOINTS.SERVICES.EXAMINATIONS.CREATE, examData);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getById(examId) {
      try {
        const response = await apiClient.get(ENDPOINTS.SERVICES.EXAMINATIONS.GET_BY_ID(examId));
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async update(examId, examData) {
      try {
        const response = await apiClient.put(ENDPOINTS.SERVICES.EXAMINATIONS.UPDATE(examId), examData);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async delete(examId) {
      try {
        const response = await apiClient.delete(ENDPOINTS.SERVICES.EXAMINATIONS.DELETE(examId));
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  },

  // Vaccinations
  vaccinations: {
    async getAll() {
      try {
        const response = await apiClient.get(ENDPOINTS.SERVICES.VACCINATIONS.LIST);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async create(vaccData) {
      try {
        const response = await apiClient.post(ENDPOINTS.SERVICES.VACCINATIONS.CREATE, vaccData);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getById(vaccId) {
      try {
        const response = await apiClient.get(ENDPOINTS.SERVICES.VACCINATIONS.GET_BY_ID(vaccId));
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async update(vaccId, vaccData) {
      try {
        const response = await apiClient.put(ENDPOINTS.SERVICES.VACCINATIONS.UPDATE(vaccId), vaccData);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async delete(vaccId) {
      try {
        const response = await apiClient.delete(ENDPOINTS.SERVICES.VACCINATIONS.DELETE(vaccId));
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  },

  // Vaccination Packages
  vaccinationPackages: {
    async getAll() {
      try {
        const response = await apiClient.get(ENDPOINTS.SERVICES.VACCINATION_PACKAGES.LIST);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async create(packageData) {
      try {
        const response = await apiClient.post(ENDPOINTS.SERVICES.VACCINATION_PACKAGES.CREATE, packageData);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async getById(packageId) {
      try {
        const response = await apiClient.get(ENDPOINTS.SERVICES.VACCINATION_PACKAGES.GET_BY_ID(packageId));
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async update(packageId, packageData) {
      try {
        const response = await apiClient.put(ENDPOINTS.SERVICES.VACCINATION_PACKAGES.UPDATE(packageId), packageData);
        return response.data;
      } catch (error) {
        throw error;
      }
    },

    async delete(packageId) {
      try {
        const response = await apiClient.delete(ENDPOINTS.SERVICES.VACCINATION_PACKAGES.DELETE(packageId));
        return response.data;
      } catch (error) {
        throw error;
      }
    }
  }
};

export default serviceService;