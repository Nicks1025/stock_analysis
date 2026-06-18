/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const earningsService = {
  getEarnings: (filters?: any) => apiClient.get('/earnings', { params: filters })
};

export default earningsService;
