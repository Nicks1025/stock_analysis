/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const taxService = {
  getTaxDetails: (params?: any) => apiClient.get('/tax/details', { params }),
  saveTaxDetails: (payload: any) => apiClient.post('/tax/details', payload)
};

export default taxService;
