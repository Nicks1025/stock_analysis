/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const screenerService = {
  screen: (filters: any, pagination: any, sort: any, search: string) => 
    apiClient.post('/screener', { filters, pagination, sort, search }),
  getSaved: () => apiClient.get('/screener/saved'),
  save: (payload: any) => apiClient.post('/screener/saved', payload),
  delete: (id: string) => apiClient.delete(`/screener/saved/${id}`)
};

export default screenerService;
