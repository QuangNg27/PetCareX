import apiClient from "@config/apiClient";
import { ENDPOINTS } from "@config/apiConfig";

export const productService = {
  // Get products, optionally filtered by branchId or query params
  getProducts: async (branchId = null, params = {}) => {
    const query = { ...params };
    if (branchId) query.branchId = branchId;
    const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, {
      params: query,
    });
    // Normalize many possible backend shapes into an array of products
    const data = response?.data;
    if (!data) return [];
    // common shapes: { products: [...] } | { data: { products: [...] } } | [...] | { success: true, data: [...] }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    if (data.data) {
      if (Array.isArray(data.data.products)) return data.data.products;
      if (Array.isArray(data.data)) return data.data;
    }
    if (Array.isArray(data.result)) return data.result;
    // Fallback: return object values if it's an object with numeric keys
    if (typeof data === "object") {
      const vals = Object.values(data).flat();
      if (Array.isArray(vals) && vals.length > 0 && typeof vals[0] === "object")
        return vals;
    }
    return [];
  },

  getProductById: async (productId) => {
    const response = await apiClient.get(
      ENDPOINTS.PRODUCTS.GET_BY_ID(productId)
    );
    // Normalize into a product object
    const data = response?.data;
    if (!data) return null;
    if (data && typeof data === "object") {
      // if payload is { product: {...} } or { data: {...} }
      if (data.product) return data.product;
      if (data.data && typeof data.data === "object") return data.data;
      // if directly the product object
      return data;
    }
    return null;
  },

  // Get medicines (products with LoaiSP = "Thuốc")
  getMedicines: async (branchId = null, params = {}) => {
    const query = { ...params, category: "Thuốc" };
    if (branchId) query.branchId = branchId;
    const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, {
      params: query,
    });
    // Normalize many possible backend shapes into an array of products
    const data = response?.data;
    if (!data) return [];
    // common shapes: { products: [...] } | { data: { products: [...] } } | [...] | { success: true, data: [...] }
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    if (data.data) {
      if (Array.isArray(data.data.products)) return data.data.products;
      if (Array.isArray(data.data)) return data.data;
    }
    if (Array.isArray(data.result)) return data.result;
    // Fallback: return object values if it's an object with numeric keys
    if (typeof data === "object") {
      const vals = Object.values(data).flat();
      if (Array.isArray(vals) && vals.length > 0 && typeof vals[0] === "object")
        return vals;
    }
    return [];
  },

  // Get products by category (LoaiSP)
  getProductsByCategory: async (
    category = null,
    branchId = null,
    params = {}
  ) => {
    const query = { ...params };
    if (category) query.category = category;
    if (branchId) query.branchId = branchId;
    const response = await apiClient.get(ENDPOINTS.PRODUCTS.LIST, {
      params: query,
    });
    // Normalize many possible backend shapes into an array of products
    const data = response?.data;
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.products)) return data.products;
    if (data.data) {
      if (Array.isArray(data.data.products)) return data.data.products;
      if (Array.isArray(data.data)) return data.data;
    }
    if (Array.isArray(data.result)) return data.result;
    if (typeof data === "object") {
      const vals = Object.values(data).flat();
      if (Array.isArray(vals) && vals.length > 0 && typeof vals[0] === "object")
        return vals;
    }
    return [];
  },
};

export default productService;
