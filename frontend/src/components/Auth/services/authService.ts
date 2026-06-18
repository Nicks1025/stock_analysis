import apiClient from '../../../services/apiClient';

export const authService = {
  register: (payload: any) => apiClient.post('/auth/register', payload),
  verifyOtp: (payload: { userId: string; otp: string; type: string }) => 
    apiClient.post('/auth/verify-otp', payload),
  login: (payload: any) => apiClient.post('/auth/login', payload),
  googleLogin: (payload: { idToken: string }) => apiClient.post('/auth/google', payload),
  logout: () => apiClient.post('/auth/logout')
};

export default authService;
