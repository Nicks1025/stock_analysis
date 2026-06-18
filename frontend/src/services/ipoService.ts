/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const ipoService = {
  getIpos: () => apiClient.get('/ipos'),
  getIpoDetails: (id: string) => apiClient.get(`/ipos/${id}`),
  createIpo: (data: any) => apiClient.post('/ipos', data),
  deleteIpo: (id: string) => apiClient.delete(`/ipos/${id}`)
};

export default ipoService;
