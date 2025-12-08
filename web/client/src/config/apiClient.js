import axios from 'axios';
import { API_CONFIG, HEADERS, CONTENT_TYPES } from './apiConfig';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  headers: {
    [HEADERS.CONTENT_TYPE]: CONTENT_TYPES.JSON,
    [HEADERS.ACCEPT]: CONTENT_TYPES.JSON,
  },
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers[HEADERS.AUTHORIZATION] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      const isLoginPage = window.location.pathname === '/login';
      const isLoginRequest = error.config?.url?.includes('/auth/login');
      
      if (!isLoginPage && !isLoginRequest) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to set auth token
export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token);
    apiClient.defaults.headers.common[HEADERS.AUTHORIZATION] = `Bearer ${token}`;
  } else {
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common[HEADERS.AUTHORIZATION];
  }
};

// Helper function to clear auth
export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('refreshToken');
  delete apiClient.defaults.headers.common[HEADERS.AUTHORIZATION];
};

export default apiClient;