import apiClient from "@config/apiClient";
import { ENDPOINTS } from "@config/apiConfig";

export const invoiceService = {
  listInvoices: async (params = {}) => {
    const response = await apiClient.get(ENDPOINTS.INVOICES.LIST, { params });
    return response.data;
  },

  createInvoice: async (payload) => {
    const response = await apiClient.post(ENDPOINTS.INVOICES.CREATE, payload);
    return response.data;
  },

  getInvoiceById: async (invoiceId) => {
    const response = await apiClient.get(
      ENDPOINTS.INVOICES.GET_BY_ID(invoiceId)
    );
    return response.data;
  },
};

export default invoiceService;
