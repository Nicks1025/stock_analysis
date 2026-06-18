/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const calendarService = {
  getEvents: (filters?: any) => apiClient.get('/calendar/events', { params: filters })
};

export default calendarService;
