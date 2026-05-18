import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Create axios instance with auth token
const createAuthenticatedRequest = () => {
  const token = localStorage.getItem('token');
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': token ? `Bearer ${token}` : '',
      'Content-Type': 'application/json'
    }
  });
};

export const onboardingAPI = {
  // Get onboarding status
  getStatus: async () => {
    const api = createAuthenticatedRequest();
    const response = await api.get('/onboarding/status');
    return response.data;
  },

  // Connect Paystack account
  connectPaystack: async (data) => {
    const api = createAuthenticatedRequest();
    const response = await api.post('/onboarding/paystack/connect', data);
    return response.data;
  },

  // Connect WhatsApp Business
  connectWhatsApp: async (data) => {
    const api = createAuthenticatedRequest();
    const response = await api.post('/onboarding/whatsapp/connect', data);
    return response.data;
  },

  // Connect Instagram (optional)
  connectInstagram: async (data) => {
    const api = createAuthenticatedRequest();
    const response = await api.post('/onboarding/instagram/connect', data);
    return response.data;
  },

  // Save store address (optional)
  saveStoreAddress: async (data) => {
    const api = createAuthenticatedRequest();
    const response = await api.post('/onboarding/store-address', data);
    return response.data;
  },

  // Complete onboarding
  complete: async () => {
    const api = createAuthenticatedRequest();
    const response = await api.post('/onboarding/complete');
    return response.data;
  },

  // Update business profile (Unified Onboarding)
  updateProfile: async (data) => {
    const api = createAuthenticatedRequest();
    const response = await api.post('/onboarding/update-profile', data);
    return response.data;
  },

  // Send verification code
  sendVerification: async (phoneNumber) => {
    const api = createAuthenticatedRequest();
    const response = await api.post('/onboarding/send-verification', { phone_number: phoneNumber });
    return response.data;
  },

  // Verify code
  verifyCode: async (code) => {
    const api = createAuthenticatedRequest();
    const response = await api.post('/onboarding/verify-phone', { code });
    return response.data;
  }
};