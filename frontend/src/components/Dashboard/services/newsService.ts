import apiClient from '../../../services/apiClient';

export const newsService = {
  getNews: (filters: any, pagination: any) => apiClient.get('/news', { params: { ...filters, ...pagination } })
};

export default newsService;
