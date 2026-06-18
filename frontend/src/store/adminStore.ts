/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

interface AdminState {
  users: any[];
  systemStats: any | null;
  auditLogs: any[];
  failedJobs: any[];
  syncStatus: any | null;
  systemHealth: any | null;
  setUsers: (users: any[]) => void;
  setSystemStats: (stats: any) => void;
  setAuditLogs: (logs: any[]) => void;
  setFailedJobs: (jobs: any[]) => void;
  setSyncStatus: (status: any) => void;
  setSystemHealth: (health: any) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  users: [],
  systemStats: null,
  auditLogs: [],
  failedJobs: [],
  syncStatus: null,
  systemHealth: null,
  setUsers: (users) => set({ users }),
  setSystemStats: (systemStats) => set({ systemStats }),
  setAuditLogs: (auditLogs) => set({ auditLogs }),
  setFailedJobs: (failedJobs) => set({ failedJobs }),
  setSyncStatus: (syncStatus) => set({ syncStatus }),
  setSystemHealth: (systemHealth) => set({ systemHealth })
}));
