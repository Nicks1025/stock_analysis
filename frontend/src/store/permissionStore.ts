/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

interface PermissionState {
  permissions: any[];
  permissionGroups: string[];
  setPermissions: (permissions: any[]) => void;
  setPermissionGroups: (groups: string[]) => void;
}

export const usePermissionStore = create<PermissionState>((set) => ({
  permissions: [],
  permissionGroups: [],
  setPermissions: (permissions) => set({ permissions }),
  setPermissionGroups: (permissionGroups) => set({ permissionGroups })
}));
