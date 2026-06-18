/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export interface Permission {
  id: string;
  key: string;
  description: string;
  group: string;
  children?: Permission[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  userCount: number;
}

interface RoleState {
  roles: Role[];
  permissions: Permission[];
  permissionTree: Permission[];
  setRoles: (roles: Role[]) => void;
  setPermissions: (permissions: Permission[]) => void;
  setPermissionTree: (tree: Permission[]) => void;
}

export const useRoleStore = create<RoleState>((set) => ({
  roles: [],
  permissions: [],
  permissionTree: [],
  setRoles: (roles) => set({ roles }),
  setPermissions: (permissions) => set({ permissions }),
  setPermissionTree: (permissionTree) => set({ permissionTree })
}));
