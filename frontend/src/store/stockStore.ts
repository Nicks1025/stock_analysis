/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export interface Quote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

export interface IndexData {
  name: string;
  symbol: string;
  value: number;
  change: number;
  changePercent: number;
}

export interface MarketStatus {
  isOpen: boolean;
  session: 'pre-market' | 'normal' | 'post-market' | 'closed';
  nextOpen?: string;
  nextClose?: string;
}

interface StockState {
  quotes: Record<string, Quote>;
  selectedStock: any | null;
  news: any[];
  searchResults: any[];
  liveIndices: IndexData[];
  marketStatus: MarketStatus | null;
  setQuote: (symbol: string, data: Quote) => void;
  setSelectedStock: (data: any) => void;
  setNews: (data: any[]) => void;
  setIndices: (data: IndexData[]) => void;
  setMarketStatus: (data: MarketStatus) => void;
}

export const useStockStore = create<StockState>((set) => ({
  quotes: {},
  selectedStock: null,
  news: [],
  searchResults: [],
  liveIndices: [],
  marketStatus: null,
  setQuote: (symbol, data) => set((state) => ({
    quotes: { ...state.quotes, [symbol]: data }
  })),
  setSelectedStock: (data) => set({ selectedStock: data }),
  setNews: (data) => set({ news: data }),
  setIndices: (data) => set({ liveIndices: data }),
  setMarketStatus: (data) => set({ marketStatus: data })
}));
