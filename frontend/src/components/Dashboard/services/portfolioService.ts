import apiClient from '../../../services/apiClient';

export const portfolioService = {
  getHoldings: (params?: any) => apiClient.get('/portfolio/holdings', { params }),
  getSummary: () => apiClient.get('/portfolio/summary'),
  addTransaction: (payload: any) => apiClient.post('/portfolio/transactions', payload),
  getRebalanceSuggestion: () => apiClient.get('/portfolio/rebalance'),
  getDividendIncome: (year: string | number) => apiClient.get('/portfolio/dividend-income', { params: { year } })
};

export default portfolioService;
