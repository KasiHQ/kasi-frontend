import api from './axios';

export const conversationAPI = {
  // Get all conversations, optionally filtered by status
  getConversations: async (status = '') => {
    const params = status ? { status } : {};
    const response = await api.get('/api/conversations', { params });
    return response.data;
  },

  // Get specific conversation
  getConversation: async (conversationId) => {
    const response = await api.get(`/api/conversations/${conversationId}`);
    return response.data;
  },

  // Update conversation status
  updateStatus: async (conversationId, data) => {
    const response = await api.patch(`/api/conversations/${conversationId}/status`, data);
    return response.data;
  },

  // Bulk update conversation status
  bulkUpdateStatus: async (data) => {
    const response = await api.post('/api/conversations/bulk-update', data);
    return response.data;
  },

  // Get pipeline summary (conversation counts by status)
  getPipeline: async () => {
    const response = await api.get('/api/conversations/pipeline');
    return response.data;
  },

  // Get conversation AI summary
  getSummary: async (conversationId) => {
    const response = await api.get(`/api/conversations/${conversationId}/summary`);
    return response.data;
  },

  // Trigger generation of a more detailed summary
  generateSummary: async (conversationId) => {
    const response = await api.post(`/api/conversations/${conversationId}/summarize`);
    return response.data;
  },

  // Set vendor instructions for a conversation
  setInstructions: async (conversationId, instructions) => {
    const response = await api.post(`/api/conversations/${conversationId}/instructions`, { instructions });
    return response.data;
  },

  // Clear vendor instructions for a conversation
  clearInstructions: async (conversationId) => {
    const response = await api.delete(`/api/conversations/${conversationId}/instructions`);
    return response.data;
  },

  // Get global gatekeeper status
  getGlobalGatekeeperStatus: async () => {
    const response = await api.get('/api/conversations/gatekeeper/status');
    return response.data;
  },

  // Toggle global gatekeeper
  toggleGlobalGatekeeper: async (isAutomated) => {
    const response = await api.post('/api/conversations/gatekeeper/toggle', { is_automated: isAutomated });
    return response.data;
  },

  // Delete conversation
  deleteConversation: async (conversationId) => {
    const response = await api.delete(`/api/conversations/${conversationId}`);
    return response.data;
  },

  // Send direct message (supports text, object, or FormData)
  sendMessage: async (conversationId, payload) => {
    if (payload instanceof FormData) {
      const response = await api.post(`/api/conversations/${conversationId}/send-message`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    }
    const body = typeof payload === 'string' ? { message: payload } : payload;
    const response = await api.post(`/api/conversations/${conversationId}/send-message`, body);
    return response.data;
  },

  // Upload chat image
  uploadImage: async (conversationId, file) => {
    const formData = new FormData();
    formData.append('image', file);
    const response = await api.post(`/api/conversations/${conversationId}/upload-image`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};