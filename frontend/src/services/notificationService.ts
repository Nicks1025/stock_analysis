/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const notificationService = {
  getNotifications: (params?: any) => apiClient.get('/notifications', { params }),
  markAsRead: (id: string) => apiClient.post(`/notifications/${id}/read`),
  markAllAsRead: () => apiClient.post('/notifications/read-all'),
  getPreferences: () => apiClient.get('/notifications/preferences'),
  savePreferences: (payload: any) => apiClient.post('/notifications/preferences', payload)
};

export default notificationService;
