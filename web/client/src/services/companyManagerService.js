import apiClient from '@config/apiClient';

export const companyManagerService = {
  // Get revenue by branch for a specific year
  getRevenueBranchYear: async (year) => {
    const response = await apiClient.get(`/api/company/revenue/branch/${year}`);
    return response.data;
  },

  // Get total revenue for a specific year
  getTotalRevenueYear: async (year) => {
    const response = await apiClient.get(`/api/company/revenue/total/${year}`);
    return response.data;
  },

  // Get revenue by services for the last 6 months
  getRevenueServicesW6M: async () => {
    const response = await apiClient.get(`/api/company/revenue/services`);
    return response.data;
  },

  // Get statistics of all pets
  getAllPetsStats: async () => {
    const response = await apiClient.get(`/api/company/pets`);
    return response.data;
  },

  // Get statistics of dog breeds
  getDogBreedsStats: async () => {
    const response = await apiClient.get(`/api/company/pets/dog-breeds`);
    return response.data;
  },

  // Get statistics of cat breeds
  getCatBreedsStats: async () => {
    const response = await apiClient.get(`/api/company/pets/cat-breeds`);
    return response.data;
  },

  // Get membership statistics
  getMembershipStats: async () => {
    const response = await apiClient.get(`/api/company/membership`);
    return response.data;
  },

  // Employee management
  getEmployees: async () => {
    const response = await apiClient.get(`/api/company/employees`);
    return response.data;
  },
  // Adding a new employee
  addEmployee: async (employeeData) => {
    const response = await apiClient.post(`/api/company/employees`, employeeData);
    return response.data;
  },
  // Updating an existing employee
  updateEmployee: async (id, employeeData) => {
    const response = await apiClient.put(`/api/company/employee/${id}`, employeeData);
    return response.data;
  },
  // Deleting an employee
  deleteEmployee: async (id) => {
    const response = await apiClient.delete(`/api/company/employee/${id}`);
    return response.data;
  }
};
