/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  pushEnabled: boolean;
  priceAlerts: boolean;
  earningsAlerts: boolean;
  dividendAlerts: boolean;
  newsAlerts: boolean;
  insiderAlerts: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  setNotifications: (notifications: Notification[]) => void;
  setUnreadCount: (unreadCount: number) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  setPreferences: (preferences: NotificationPreferences) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,
  preferences: null,
  setNotifications: (notifications) => set({ notifications }),
  setUnreadCount: (unreadCount) => set({ unreadCount }),
  markRead: (id) => set((state) => {
    const updated = state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n);
    const unread = updated.filter((n) => !n.isRead).length;
    return { notifications: updated, unreadCount: unread };
  }),
  markAllRead: () => set((state) => {
    const updated = state.notifications.map((n) => ({ ...n, isRead: true }));
    return { notifications: updated, unreadCount: 0 };
  }),
  setPreferences: (preferences) => set({ preferences })
}));
