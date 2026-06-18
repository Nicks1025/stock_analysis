import apiClient from '../../../services/apiClient';

export const watchlistService = {
  getAll: () => apiClient.get('/watchlists'),
  addStock: (id: string, payload: { stock_id: string }) => apiClient.post(`/watchlists/${id}/stocks`, payload),
  addNote: (id: string, payload: { stock_id: string; note: string }) => apiClient.post(`/watchlists/${id}/notes`, payload),
  getNotes: (id: string) => apiClient.get(`/watchlists/${id}/notes`),
  addTag: (id: string, payload: { stock_id: string; tag: string }) => apiClient.post(`/watchlists/${id}/tags`, payload),
  getTags: (id: string) => apiClient.get(`/watchlists/${id}/tags`)
};

export default watchlistService;
