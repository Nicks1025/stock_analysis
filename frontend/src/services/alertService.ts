/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const alertService = {
  getAlerts: () => apiClient.get('/alerts'),
  createAlert: (payload: any) => apiClient.post('/alerts', payload),
  deleteAlert: (id: string) => apiClient.delete(`/alerts/${id}`)
};

export default alertService;
