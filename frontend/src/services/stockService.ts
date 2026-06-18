/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const stockService = {
  searchStocks: (query: string) => apiClient.get('/stocks/search', { params: { q: query } }),
  getLiveIndices: () => apiClient.get('/stocks/indices/live'),
  getQuote: (symbol: string) => apiClient.get(`/stocks/${symbol}/quote`),
  getValuation: (symbol: string) => apiClient.get(`/stocks/${symbol}/valuation`),
  getFinancials: (symbol: string) => apiClient.get(`/stocks/${symbol}/financials`),
  getStockNews: (symbol: string, params?: any) => apiClient.get(`/stocks/${symbol}/news`, { params }),
  getPeers: (symbol: string) => apiClient.get(`/stocks/${symbol}/peers`),
  getAiAnalysis: (symbol: string) => apiClient.get(`/stocks/${symbol}/analysis`),
  getShareholding: (symbol: string) => apiClient.get(`/stocks/${symbol}/shareholding`),
  getDividends: (symbol: string) => apiClient.get(`/stocks/${symbol}/dividends`),
  getSplits: (symbol: string) => apiClient.get(`/stocks/${symbol}/splits`),
  getCatalysts: (symbol: string) => apiClient.get(`/stocks/${symbol}/catalysts`),
  getFreshness: (symbol: string) => apiClient.get(`/stocks/${symbol}/freshness`),
  getBulkDeals: (symbol: string) => apiClient.get(`/stocks/${symbol}/bulk-deals`),
  getEarnings: (symbol: string) => apiClient.get(`/stocks/${symbol}/earnings`),
  get52WeekRange: (symbol: string) => apiClient.get(`/stocks/${symbol}/52week-range`),
  getInsiderActivity: (symbol: string) => apiClient.get(`/stocks/${symbol}/insider-activity`),
  getHistory: (symbol: string, params: { period: string; interval: string }) => 
    apiClient.get(`/stocks/${symbol}/history`, { params }),
  getTopGainers: () => apiClient.get('/stocks/movers/gainers'),
  getTopLosers: () => apiClient.get('/stocks/movers/losers'),
  getFiiDiiActivity: () => apiClient.get('/market/fii-dii'),
  getFiiDiiHistory: (days: number = 30) => apiClient.get('/market/fii-dii/history', { params: { days } }),
  getMarketStatus: () => apiClient.get('/market/status'),
  markViewed: (symbol: string) => apiClient.post(`/stocks/${symbol}/viewed`),
  getRecentlyViewed: () => apiClient.get('/stocks/recently-viewed')
};

export default stockService;
