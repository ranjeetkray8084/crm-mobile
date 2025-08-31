// API Configuration for CRMNativeExpo
// Change the IP address here to match your local network

export const API_CONFIG = {
  // Development - Change this IP to match your computer's IP address
  DEVELOPMENT: {
    baseURL: 'https://backend.leadstracker.in', // Production backend
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  
  // Production
  PRODUCTION: {
    baseURL: 'https://backend.leadstracker.in',
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  
  // Local Network IPs - Add your common IP addresses here
  LOCAL_IPS: [
    'backend.leadstracker.in',  // Production backend
    '192.168.0.100',  // Alternative home router IP
    '10.0.0.100',     // Alternative network range
    '172.20.10.100'   // Mobile hotspot IP
  ]
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    VERIFY: '/api/auth/verify',
  },
  
  // Push Notifications
  PUSH_NOTIFICATIONS: {
    REGISTER: '/api/push-notifications/register',
    LOGOUT: '/api/push-notifications/logout',
    STATUS: '/api/push-notifications/status',
    TEST: '/api/push-notifications/test',
    TOKENS: '/api/push-notifications/tokens',
  },
  
  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    MARK_READ: '/api/notifications/mark-read',
    TEST_WITH_PUSH: '/api/notifications/test-with-push',
  },
  
  // Leads
  LEADS: {
    LIST: '/api/leads',
    CREATE: '/api/leads',
    UPDATE: (id) => `/api/leads/${id}`,
    DELETE: (id) => `/api/leads/${id}`,
    SEARCH: (companyId) => `/api/leads/search/${companyId}`,
  },
  
  // Users
  USERS: {
    LIST: '/api/users',
    CREATE: '/api/users',
    UPDATE: (id) => `/api/users/${id}`,
    DELETE: (id) => `/api/users/${id}`,
    PROFILE: '/api/users/profile',
  },
  
  // Companies
  COMPANIES: {
    LIST: '/api/companies',
    CREATE: '/api/companies',
    UPDATE: (id) => `/api/companies/${id}`,
    DELETE: (id) => `/api/companies/${id}`,
  },
  
  // Tasks
  TASKS: {
    LIST: '/api/tasks',
    CREATE: '/api/tasks',
    UPDATE: (id) => `/api/tasks/${id}`,
    DELETE: (id) => `/api/tasks/${id}`,
  },
  
  // Properties
  PROPERTIES: {
    LIST: '/api/properties',
    CREATE: '/api/properties',
    UPDATE: (id) => `/api/properties/${id}`,
    DELETE: (id) => `/api/properties/${id}`,
  },
  
  // Notes
  NOTES: {
    LIST: '/api/notes',
    CREATE: '/api/notes',
    UPDATE: (id) => `/api/notes/${id}`,
    DELETE: (id) => `/api/notes/${id}`,
  },
  
  // Announcements
  ANNOUNCEMENTS: {
    LIST: '/api/announcements',
    CREATE: '/api/announcements',
    UPDATE: (id) => `/api/announcements/${id}`,
    DELETE: (id) => `/api/announcements/${id}`,
  },
};

// Get current API configuration based on environment
export const getCurrentApiConfig = () => {
  const environment = process.env.NODE_ENV || 'development';
  
  if (environment === 'production') {
    return API_CONFIG.PRODUCTION;
  }
  
  return API_CONFIG.DEVELOPMENT;
};

// Get base URL for current environment
export const getApiBaseUrl = () => {
  return getCurrentApiConfig().baseURL;
};

// Helper function to update IP address
export const updateLocalIp = (newIp) => {
  if (newIp && typeof newIp === 'string') {
    // Remove http:// or https:// if present
    const cleanIp = newIp.replace(/^https?:\/\//, '');
    
    // Validate IP format (basic validation)
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipRegex.test(cleanIp)) {
      API_CONFIG.DEVELOPMENT.baseURL = `http://${cleanIp}:8082`;
      console.log(`✅ API IP updated to: ${API_CONFIG.DEVELOPMENT.baseURL}`);
      return true;
    } else {
      console.error('❌ Invalid IP address format. Please use format: backend.leadstracker.in');
      return false;
    }
  }
  return false;
};

// Get all available local IPs for easy switching
export const getAvailableLocalIps = () => {
  return API_CONFIG.LOCAL_IPS;
};

// Quick IP update functions
export const setCommonIp = (ipType) => {
  const commonIps = {
    'home': 'backend.leadstracker.in',
    'office': '192.168.0.100',
    'mobile': '172.20.10.100'
  };
  
  if (commonIps[ipType]) {
    return updateLocalIp(commonIps[ipType]);
  }
  
  console.error('❌ Unknown IP type. Available types:', Object.keys(commonIps));
  return false;
};

export default API_CONFIG;
