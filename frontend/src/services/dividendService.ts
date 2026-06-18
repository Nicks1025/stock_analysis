/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const dividendService = {
  getDividends: (filters?: any) => apiClient.get('/dividends', { params: filters })
};

export default dividendService;
