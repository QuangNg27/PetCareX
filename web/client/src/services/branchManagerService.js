import apiClient from '@config/apiClient';

export const branchManagerService = {
  // Feature 1: Get employees in the branch
  getEmployees: async (branchId, filters = {}) => {
    const params = new URLSearchParams({ branchId, ...filters });
    const response = await apiClient.get(`/employees?${params}`);
    return response.data;
  },

  // Feature 2: Revenue statistics by period
  getRevenueStats: async (branchId, period, startDate, endDate) => {
    const response = await apiClient.get('/reports/revenue', {
      params: { branchId, period, startDate, endDate }
    });
    return response.data;
  },

  // Feature 3: List of vaccinated pets in period
  getVaccinatedPets: async (branchId, startDate, endDate) => {
    const response = await apiClient.get('/reports/vaccinated-pets', {
      params: { branchId, startDate, endDate }
    });
    return response.data;
  },

  // Feature 4: Most ordered vaccines
  getPopularVaccines: async (branchId, limit = 10) => {
    const response = await apiClient.get('/reports/popular-vaccines', {
      params: { branchId, limit }
    });
    return response.data;
  },

  // Feature 5: Product inventory
  getProductInventory: async (branchId, filters = {}) => {
    const response = await apiClient.get('/products/inventory', {
      params: { branchId, ...filters }
    });
    return response.data;
  },

  // Feature 6: Search vaccines (combined with inventory)
  searchProducts: async (branchId, searchParams) => {
    const response = await apiClient.get('/products/search', {
      params: { branchId, ...searchParams }
    });
    return response.data;
  },

  // Feature 7: Pet medical history and vaccination records
  getPetHistory: async (petId) => {
    const response = await apiClient.get(`/customers/pets/${petId}/history`);
    return response.data;
  },

  // Feature 8: Employee performance
  getEmployeePerformance: async (branchId, employeeId = null, startDate, endDate) => {
    const response = await apiClient.get('/reports/employee-performance', {
      params: { branchId, employeeId, startDate, endDate }
    });
    return response.data;
  },

  // Feature 9: Customer statistics
  getCustomerStats: async (branchId, inactiveDays = 90) => {
    const response = await apiClient.get('/reports/customer-stats', {
      params: { branchId, inactiveDays }
    });
    return response.data;
  },

  // Feature 10: Get branch services
  getBranchServices: async (branchId) => {
    const response = await apiClient.get(`/branches/${branchId}/services`);
    return response.data;
  },

  // Feature 10: Update branch service
  updateBranchService: async (branchId, serviceId, data) => {
    const response = await apiClient.put(`/branches/${branchId}/services/${serviceId}`, data);
    return response.data;
  },

  // Get branch details
  getBranchInfo: async (branchId) => {
    const response = await apiClient.get(`/branches/${branchId}`);
    return response.data;
  }
};
