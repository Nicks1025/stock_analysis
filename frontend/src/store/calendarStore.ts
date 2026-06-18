/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export interface EconomicEvent {
  eventName: string;
  impact: 'high' | 'medium' | 'low';
  actual?: number | string;
  forecast?: number | string;
  previous?: number | string;
  eventTime: string;
  affectedSectors: string[];
}

export interface DividendEvent {
  company: string;
  symbol: string;
  exDate: string;
  recordDate: string;
  paymentDate?: string;
  amount: number;
  yieldPercent: number;
  type: string;
}

export interface EarningsEvent {
  symbol: string;
  expectedEps?: number;
  previousEps?: number;
  earningsDate: string;
  surprisePercent?: number;
}

interface CalendarFilters {
  impact: string;
  country: string;
  dateFrom: string;
  dateTo: string;
}

interface CalendarState {
  economicEvents: EconomicEvent[];
  dividendEvents: DividendEvent[];
  earningsEvents: EarningsEvent[];
  filters: CalendarFilters;
  setEconomicEvents: (events: EconomicEvent[]) => void;
  setDividendEvents: (events: DividendEvent[]) => void;
  setEarningsEvents: (events: EarningsEvent[]) => void;
  setFilters: (filters: Partial<CalendarFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: CalendarFilters = {
  impact: '',
  country: 'India',
  dateFrom: '',
  dateTo: ''
};

export const useCalendarStore = create<CalendarState>((set) => ({
  economicEvents: [],
  dividendEvents: [],
  earningsEvents: [],
  filters: defaultFilters,
  setEconomicEvents: (economicEvents) => set({ economicEvents }),
  setDividendEvents: (dividendEvents) => set({ dividendEvents }),
  setEarningsEvents: (earningsEvents) => set({ earningsEvents }),
  setFilters: (incoming) => set((state) => ({ filters: { ...state.filters, ...incoming } })),
  resetFilters: () => set({ filters: defaultFilters })
}));
