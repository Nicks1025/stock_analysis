/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const mutualFundService = {
  explore: (filters: any, pagination: any) => apiClient.post('/mutual-funds/explore', { filters, pagination }),
  getMyInvestments: () => apiClient.get('/mutual-funds/investments'),
  getRebalanceSuggestion: () => apiClient.get('/mutual-funds/rebalance')
};

export default mutualFundService;
