/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const adminService = {
  getDashboardAnalytics: () => apiClient.get('/admin/analytics'),
  getSystemLogs: () => apiClient.get('/admin/logs'),
  getCacheStatus: () => apiClient.get('/admin/cache'),
  clearCache: () => apiClient.post('/admin/cache/clear'),
  getAuditTrail: () => apiClient.get('/admin/audit')
};

export default adminService;
