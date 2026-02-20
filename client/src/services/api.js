import axios from 'axios';

/**
 * Axios instance configured for AstroView API
 */
const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
const normalizedBase = rawBase.replace(/\/api\/?$/, '');

const api = axios.create({
  baseURL: `${normalizedBase}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Add any auth tokens, logging, etc.
 */
api.interceptors.request.use(
  (config) => {
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, config.params || '');
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handle responses and errors globally
 */
api.interceptors.response.use(
  (response) => {
    // Log responses in development
    if (import.meta.env.DEV) {
      const cached = response.data?._cached ? '💾 CACHED' : '✨ FRESH';
      console.log(`✅ API Response: ${response.config.url} ${cached}`);
    }
    
    return response;
  },
  (error) => {
    // Handle errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      // Handle specific status codes
      if (status === 401) {
        // Unauthorized - could redirect to login
        console.error('Unauthorized access');
      } else if (status === 429) {
        // Rate limit exceeded - suppress logging as it's handled gracefully
        if (import.meta.env.DEV) {
          console.warn('⚠️ Rate limit hit for:', error.config?.url);
        }
      } else if (status === 503) {
        // Service unavailable
        console.error('Service temporarily unavailable');
      } else {
        // Log other error statuses
        console.error(`❌ API Error ${status}:`, data?.message || data);
      }
    } else if (error.request) {
      // Request made but no response
      console.error('❌ Network Error: No response from server');
    } else {
      // Something else happened
      console.error('❌ Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
