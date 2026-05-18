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
  }
};