// API configuration
export const API_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://api.petcarex.com' 
    : 'http://localhost:3000',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

// API endpoints based on server routes
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    CHANGE_PASSWORD: '/api/auth/change-password',
    PROFILE: '/api/auth/profile'
  },
  
  CUSTOMERS: {
    PROFILE: '/api/customers/profile',
    SPENDING: '/api/customers/spending',
    LOYALTY_HISTORY: '/api/customers/loyalty-history',
    SEARCH: '/api/customers/search',
    
    PETS: {
      CREATE: '/api/customers/pets',
      LIST: '/api/customers/pets',
      GET_BY_ID: (petId) => `/api/customers/pets/${petId}`,
      UPDATE: (petId) => `/api/customers/pets/${petId}`,
      DELETE: (petId) => `/api/customers/pets/${petId}`,
      MEDICAL_HISTORY: (petId) => `/api/customers/pets/${petId}/medical-history`
    }
  },
  
  SERVICES: {
    BY_BRANCH: (branchId) => `/api/services/branches/${branchId}/services`,
    
    EXAMINATIONS: {
      CREATE: '/api/services/examinations',
      LIST: '/api/services/examinations',
      GET_BY_ID: (examId) => `/api/services/examinations/${examId}`,
      UPDATE: (examId) => `/api/services/examinations/${examId}`,
      DELETE: (examId) => `/api/services/examinations/${examId}`
    },
    
    VACCINATIONS: {
      CREATE: '/api/services/vaccinations',
      LIST: '/api/services/vaccinations',
      GET_BY_ID: (vaccId) => `/api/services/vaccinations/${vaccId}`,
      UPDATE: (vaccId) => `/api/services/vaccinations/${vaccId}`,
      DELETE: (vaccId) => `/api/services/vaccinations/${vaccId}`
    },
    
    VACCINATION_PACKAGES: {
      CREATE: '/api/services/vaccination-packages',
      LIST: '/api/services/vaccination-packages',
      GET_BY_ID: (packageId) => `/api/services/vaccination-packages/${packageId}`,
      UPDATE: (packageId) => `/api/services/vaccination-packages/${packageId}`,
      DELETE: (packageId) => `/api/services/vaccination-packages/${packageId}`
    }
  },
  
  BRANCHES: {
    LIST: '/api/branches',
    GET_BY_ID: (branchId) => `/api/branches/${branchId}`,
    EMPLOYEES: (branchId) => `/api/branches/${branchId}/employees`,
    SERVICES: (branchId) => `/api/branches/${branchId}/services`
  },
  
  EMPLOYEES: {
    PROFILE: '/api/employees/profile',
    LIST: '/api/employees',
    ROLES: '/api/employees/roles',
    ASSIGNMENTS: '/api/employees/assignments',
    BRANCHES: '/api/employees/branches',
    GET_BY_ID: (employeeId) => `/api/employees/${employeeId}`,
    UPDATE: (employeeId) => `/api/employees/${employeeId}`,
    DELETE: (employeeId) => `/api/employees/${employeeId}`,
    ASSIGN_ROLE: (employeeId) => `/api/employees/${employeeId}/assign-role`
  },
  
  PRODUCTS: {
    LIST: '/api/products',
    CATEGORIES: '/api/products/categories',
    CREATE: '/api/products',
    GET_BY_ID: (productId) => `/api/products/${productId}`,
    UPDATE: (productId) => `/api/products/${productId}`,
    DELETE: (productId) => `/api/products/${productId}`,
    
    INVENTORY: {
      CHECK: (productId) => `/api/products/inventory/${productId}`,
      UPDATE: (productId) => `/api/products/inventory/${productId}`,
      ALERTS: '/api/products/alerts',
      LOW_STOCK: '/api/products/alerts/low-stock',
      EXPIRED: '/api/products/alerts/expired'
    }
  },
  
  INVOICES: {
    LIST: '/api/invoices',
    CREATE: '/api/invoices',
    GET_BY_ID: (invoiceId) => `/api/invoices/${invoiceId}`,
    UPDATE: (invoiceId) => `/api/invoices/${invoiceId}`,
    DELETE: (invoiceId) => `/api/invoices/${invoiceId}`,
    BY_CUSTOMER: (customerId) => `/api/invoices/customer/${customerId}`,
    MY_INVOICES: '/api/invoices/my/invoices',
    BY_BRANCH: (branchId) => `/api/invoices/branch/${branchId}`
  },
  
  REVIEWS: {
    LIST: '/api/reviews',
    CREATE: '/api/reviews',
    MY_REVIEWS: '/api/reviews/my-reviews',
    RECENT: '/api/reviews/recent',
    BY_CUSTOMER: (customerId) => `/api/reviews/customer/${customerId}`,
    BY_BRANCH: (branchId) => `/api/reviews/branch/${branchId}`,
    GET_BY_ID: (reviewId) => `/api/reviews/${reviewId}`,
    UPDATE: (reviewId) => `/api/reviews/${reviewId}`,
    DELETE: (reviewId) => `/api/reviews/${reviewId}`
  },
  
  REPORTS: {
    REVENUE: {
      DAILY: '/api/reports/revenue/daily',
      MONTHLY: '/api/reports/revenue/monthly',
      YEARLY: '/api/reports/revenue/yearly',
      BY_BRANCH: '/api/reports/revenue/by-branch',
      BY_SERVICE: '/api/reports/revenue/by-service',
      BY_EMPLOYEE: '/api/reports/revenue/by-employee'
    },
    
    ANALYTICS: {
      CUSTOMER: '/api/reports/analytics/customers',
      SERVICES: '/api/reports/analytics/services',
      PRODUCTS: '/api/reports/analytics/products',
      BRANCH_PERFORMANCE: '/api/reports/analytics/branch-performance'
    },
    
    DASHBOARD: '/api/reports/dashboard',
    EXPORT: {
      REVENUE: '/api/reports/export/revenue',
      CUSTOMERS: '/api/reports/export/customers',
      SERVICES: '/api/reports/export/services'
    }
  }
};

// HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
};

// Request headers
export const HEADERS = {
  CONTENT_TYPE: 'Content-Type',
  AUTHORIZATION: 'Authorization',
  ACCEPT: 'Accept'
};

// Content types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded'
};

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng',
  UNAUTHORIZED: 'Bạn cần đăng nhập để thực hiện hành động này',
  FORBIDDEN: 'Bạn không có quyền thực hiện hành động này',
  NOT_FOUND: 'Không tìm thấy dữ liệu',
  SERVER_ERROR: 'Lỗi server, vui lòng thử lại sau',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ'
};

export default {
  API_CONFIG,
  ENDPOINTS,
  HTTP_STATUS,
  HEADERS,
  CONTENT_TYPES,
  ERROR_MESSAGES
};