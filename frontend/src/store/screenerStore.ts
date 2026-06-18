/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

interface Filters {
  peMax?: number;
  roeMin?: number;
  sector?: string;
  stockType?: string[];
  [key: string]: any;
}

interface Pagination {
  page: number;
  limit: number;
}

interface Sort {
  key: string;
  order: 'ASC' | 'DESC' | '';
}

interface ScreenerState {
  filters: Filters;
  pagination: Pagination;
  sort: Sort;
  search: string;
  results: any[];
  savedScreeners: any[];
  setFilters: (filters: Filters) => void;
  resetFilters: () => void;
  setPagination: (page: number, limit: number) => void;
  setSort: (key: string, order: 'ASC' | 'DESC' | '') => void;
  setSearch: (search: string) => void;
  setResults: (results: any[]) => void;
  setSavedScreeners: (savedScreeners: any[]) => void;
}

const defaultFilters: Filters = {};

export const useScreenerStore = create<ScreenerState>((set) => ({
  filters: defaultFilters,
  pagination: { page: 1, limit: 10 },
  sort: { key: '', order: '' },
  search: '',
  results: [],
  savedScreeners: [],
  setFilters: (filters) => set({ filters }),
  resetFilters: () => set({ filters: defaultFilters }),
  setPagination: (page, limit) => set({ pagination: { page, limit } }),
  setSort: (key, order) => set({ sort: { key, order } }),
  setSearch: (search) => set({ search }),
  setResults: (results) => set({ results }),
  setSavedScreeners: (savedScreeners) => set({ savedScreeners })
}));
