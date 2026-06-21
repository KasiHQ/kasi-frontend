import api from './axios';

const API_PREFIX = '/api';

export const onboardingAPI = {
  // Get onboarding status
  getStatus: async () => {
    const response = await api.get(`${API_PREFIX}/onboarding/status`);
    return response.data;
  },

  // Connect Paystack account
  connectPaystack: async (data) => {
    const response = await api.post(`${API_PREFIX}/onboarding/paystack/connect`, data);
    return response.data;
  },

  // Connect WhatsApp Business
  connectWhatsApp: async (data) => {
    const response = await api.post(`${API_PREFIX}/onboarding/whatsapp/connect`, data);
    return response.data;
  },

  // Connect Instagram (optional)
  connectInstagram: async (data) => {
    const response = await api.post(`${API_PREFIX}/onboarding/instagram/connect`, data);
    return response.data;
  },

  // Save store address (optional)
  saveStoreAddress: async (data) => {
    const response = await api.post(`${API_PREFIX}/onboarding/store-address`, data);
    return response.data;
  },

  // Complete onboarding
  complete: async () => {
    const response = await api.post(`${API_PREFIX}/onboarding/complete`);
    return response.data;
  },

  // Update business profile (Unified Onboarding)
  updateProfile: async (data) => {
    const response = await api.post(`${API_PREFIX}/onboarding/update-profile`, data);
    return response.data;
  },

  // Send verification code
  sendVerification: async (phoneNumber) => {
    const response = await api.post(`${API_PREFIX}/onboarding/send-verification`, { phone_number: phoneNumber });
    return response.data;
  },

  // Verify code
  verifyCode: async (code) => {
    const response = await api.post(`${API_PREFIX}/onboarding/verify-phone`, { code });
    return response.data;
  }
};