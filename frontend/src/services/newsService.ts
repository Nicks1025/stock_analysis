/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const newsService = {
  getNews: (filters: any, pagination: any) => apiClient.get('/news', { params: { ...filters, ...pagination } })
};

export default newsService;
