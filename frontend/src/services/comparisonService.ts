/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const comparisonService = {
  compare: (symbols: string[]) => apiClient.post('/comparison', { symbols })
};

export default comparisonService;
