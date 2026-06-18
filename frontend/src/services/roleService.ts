/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const roleService = {
  getRoles: () => apiClient.get('/roles'),
  createRole: (payload: any) => apiClient.post('/roles', payload),
  updateRole: (id: string, payload: any) => apiClient.put(`/roles/${id}`, payload),
  deleteRole: (id: string) => apiClient.delete(`/roles/${id}`)
};

export default roleService;
