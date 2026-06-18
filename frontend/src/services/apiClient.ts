/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios, { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/authStore';

const apiClient = axios.create({
  baseURL: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 15000,
  headers: { 
    'Content-Type': 'application/json' 
  },
  withCredentials: true
});

// Request Interceptor: Attach bearer accessToken dynamically from useAuthStore
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Refresh token callback synchronization queue
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: string | null) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Unwrap data layer, handle implicit 401 authorization renewals
apiClient.interceptors.response.use(
  (res) => {
    // Unwrap axios wrapper so service functions receive schema fields directly
    return res.data;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Mitigate redundant refresh loops or non-401 failure modes
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (isRefreshing) {
        return new Promise<string | null>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return apiClient(originalRequest);
        });
      }
      
      isRefreshing = true;
      
      try {
        const currentRefreshToken = useAuthStore.getState().refreshToken;
        if (!currentRefreshToken) {
          throw new Error('No refresh token available');
        }
        
        // Decouple Circular Dependency by requesting renewal via direct non-intercepted Axios call
        const response = await axios.post(
          `${(import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'}/auth/refresh-token`,
          { refreshToken: currentRefreshToken }
        );
        
        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        
        // Store updated tokens
        useAuthStore.getState().updateTokens(
          accessToken,
          newRefreshToken || currentRefreshToken
        );
        
        processQueue(null, accessToken);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        }
        return apiClient(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        
        // Relocate gracefully on hard session failure
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
