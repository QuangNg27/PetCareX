import apiClient from '@config/apiClient';

export const branchManagerService = {
  // Feature 1: Get employees in the branch
  getEmployees: async (branchId, filters = {}) => {
    const params = new URLSearchParams({ branchId, ...filters });
    const response = await apiClient.get(`/api/employees?${params}`);
    return response.data;
  },

  // Feature 2: Revenue statistics by period
  getRevenueStats: async (branchId, period, param1, param2) => {
    let endpoint = '/api/reports/revenue/monthly'; // default
    let params = { branchId };
    
    switch (period) {
      case 'day':
        endpoint = '/api/reports/revenue/daily';
        params = { branchId, startDate: param1, endDate: param2 };
        break;
      case 'month':
        endpoint = '/api/reports/revenue/monthly';
        params = { branchId, year: param1 };
        break;
      case 'quarter':
        endpoint = '/api/reports/revenue/quarterly';
        params = { branchId, year: param1 };
        break;
      case 'year':
        endpoint = '/api/reports/revenue/yearly';
        params = { branchId, startYear: param1, endYear: param2 };
        break;
    }
    
    console.log('🔌 API Request:', { endpoint, params });
    
    const response = await apiClient.get(endpoint, { params });
    
    return response.data;
  },

  // Feature 3: List of vaccinated pets in period
  getVaccinatedPets: async (branchId, startDate, endDate) => {
    const response = await apiClient.get('/api/reports/vaccinated-pets', {
      params: { branchId, startDate, endDate }
    });
    return response.data;
  },

  // Feature 4: Most ordered vaccines
  getPopularVaccines: async (branchId, limit = 10) => {
    const response = await apiClient.get('/api/reports/popular-vaccines', {
      params: { branchId, limit }
    });
    return response.data;
  },

  // Feature 5: Product inventory
  getProductInventory: async (branchId, filters = {}) => {
    const response = await apiClient.get('/api/products/by-branch', {
      params: { branchId, ...filters }
    });
    return response.data;
  },

  // Feature 6: Search products
  searchProducts: async (branchId, searchParams) => {
    const response = await apiClient.get('/api/products/by-branch', {
      params: { branchId, ...searchParams }
    });
    return response.data;
  },

  // Feature 7: Pet medical history at branch
  getPetMedicalHistory: async (petId, branchId) => {
    const response = await apiClient.get(`/api/reports/pets/${petId}/medical-history`, {
      params: { branchId }
    });
    return response.data;
  },

  // Feature 7: Pet vaccination history at branch
  getPetVaccinationHistory: async (petId, branchId) => {
    const response = await apiClient.get(`/api/reports/pets/${petId}/vaccination-history`, {
      params: { branchId }
    });
    return response.data;
  },

  // Feature 8: Employee performance
  getEmployeePerformance: async (employeeId = null) => {
    const params = {};
    if (employeeId) {
      params.employeeId = employeeId;
    }
    const response = await apiClient.get('/api/reports/employee-performance', { params });
    return response.data;
  },

  // Feature 9: Customer statistics
  getCustomerStats: async (inactiveDays = 90) => {
    const response = await apiClient.get('/api/reports/customer-stats', {
      params: { inactiveDays }
    });
    return response.data;
  },

  // Get branch details
  getBranchInfo: async (branchId) => {
    const response = await apiClient.get(`/api/branches/${branchId}`);
    return response.data;
  },

  // Get branch rating stats
  getBranchRatingStats: async (branchId) => {
    const response = await apiClient.get(`/api/reviews/branch/${branchId}/stats`);
    return response.data;
  }
};
