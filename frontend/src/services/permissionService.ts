/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import apiClient from './apiClient';

export const permissionService = {
  getPermissionsCount: () => apiClient.get('/permissions/count'),
  getModulePermissions: () => apiClient.get('/permissions/modules')
};

export default permissionService;
