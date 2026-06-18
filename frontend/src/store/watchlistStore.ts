/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export interface Watchlist {
  id: string;
  name: string;
  stocks: any[];
}

export interface WatchlistNote {
  id: string;
  stockSymbol: string;
  note: string;
  createdAt: string;
}

export interface WatchlistTag {
  stockSymbol: string;
  tag: string;
}

interface WatchlistState {
  watchlists: Watchlist[];
  selectedWatchlist: Watchlist | null;
  notes: WatchlistNote[];
  tags: WatchlistTag[];
  setWatchlists: (watchlists: Watchlist[]) => void;
  setSelected: (watchlist: Watchlist | null) => void;
  setNotes: (notes: WatchlistNote[]) => void;
  setTags: (tags: WatchlistTag[]) => void;
  addNote: (note: WatchlistNote) => void;
  addTag: (tag: WatchlistTag) => void;
}

export const useWatchlistStore = create<WatchlistState>((set) => ({
  watchlists: [],
  selectedWatchlist: null,
  notes: [],
  tags: [],
  setWatchlists: (watchlists) => set({ watchlists }),
  setSelected: (selectedWatchlist) => set({ selectedWatchlist }),
  setNotes: (notes) => set({ notes }),
  setTags: (tags) => set({ tags }),
  addNote: (note) => set((state) => ({ notes: [...state.notes, note] })),
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] }))
}));
