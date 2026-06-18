/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

interface NewsFilters {
  sector: string;
  sentiment: string;
  search: string;
}

interface NewsState {
  news: any[];
  filters: NewsFilters;
  pagination: { page: number; limit: number };
  setNews: (news: any[]) => void;
  setFilters: (filters: Partial<NewsFilters>) => void;
  setPagination: (page: number, limit: number) => void;
  resetFilters: () => void;
}

const defaultFilters: NewsFilters = {
  sector: '',
  sentiment: '',
  search: ''
};

export const useNewsStore = create<NewsState>((set) => ({
  news: [],
  filters: defaultFilters,
  pagination: { page: 1, limit: 20 },
  setNews: (news) => set({ news }),
  setFilters: (incoming) => set((state) => ({ filters: { ...state.filters, ...incoming } })),
  setPagination: (page, limit) => set({ pagination: { page, limit } }),
  resetFilters: () => set({ filters: defaultFilters })
}));
