/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const goalService = {
  getGoals: () => apiClient.get('/goals'),
  createGoal: (payload: any) => apiClient.post('/goals', payload),
  deleteGoal: (id: string) => apiClient.delete(`/goals/${id}`)
};

export default goalService;
