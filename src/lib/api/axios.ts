import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import https from 'https';

// Backend uses global prefix 'api', so we need to include it
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

// Flag to prevent multiple simultaneous logout attempts
let isLoggingOut = false;

// Create HTTPS agent for self-signed certificates in staging
// For staging environments, we need to accept self-signed certificates
const isStaging = API_BASE_URL.includes('staging');
const httpsAgent = API_BASE_URL.startsWith('https') && isStaging
  ? new https.Agent({ rejectUnauthorized: false })
  : undefined;

export const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  ...(httpsAgent && { httpsAgent }),
});

api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    const token = session?.accessToken;

    if (token) {
      config.headers = {
        ...(config.headers || {}),
        Authorization: `Bearer ${token}`,
      };
    }

    // Log request
    console.log('🚀 HTTP Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: {
        ...config.headers,
        // Sanitize sensitive headers
        Authorization: config.headers?.Authorization ? '[REDACTED]' : undefined,
      },
      params: config.params,
      data: config.data,
      timestamp: new Date().toISOString(),
    });

    return config;
  },
  (error) => {
    // Log request error
    console.error('❌ HTTP Request Error:', {
      message: error.message,
      config: error.config ? {
        method: error.config.method?.toUpperCase(),
        url: error.config.url,
        baseURL: error.config.baseURL,
      } : undefined,
      timestamp: new Date().toISOString(),
    });
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Log successful response
    console.log('✅ HTTP Response:', {
      status: response.status,
      statusText: response.statusText,
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      baseURL: response.config.baseURL,
      fullURL: `${response.config.baseURL}${response.config.url}`,
      headers: response.headers,
      data: response.data,
      timestamp: new Date().toISOString(),
    });
    return response;
  },
  async (error) => {
    // Log error response
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('❌ HTTP Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : undefined,
        headers: error.response.headers,
        data: error.response.data,
        timestamp: new Date().toISOString(),
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('❌ HTTP No Response:', {
        message: error.message,
        method: error.config?.method?.toUpperCase(),
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: error.config ? `${error.config.baseURL}${error.config.url}` : undefined,
        timestamp: new Date().toISOString(),
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('❌ HTTP Request Setup Error:', {
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    }

    if (error.response?.status === 401 && !isLoggingOut) {
      // Handle unauthorized - logout user and redirect to login
      isLoggingOut = true;
      console.warn('⚠️ 401 Unauthorized - Logging out user and redirecting to login');
      
      // Clear any local storage/session storage that might contain user data
      if (typeof window !== 'undefined') {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {
          console.warn('Failed to clear storage:', e);
        }
      }

      // Sign out from NextAuth and redirect to login
      signOut({ 
        callbackUrl: '/login',
        redirect: true 
      }).catch((signOutError) => {
        console.error('Error during sign out:', signOutError);
        // Fallback: redirect manually if signOut fails
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      }).finally(() => {
        // Reset flag after a delay to allow for redirect
        setTimeout(() => {
          isLoggingOut = false;
        }, 1000);
      });
    }
    return Promise.reject(error);
  }
);

