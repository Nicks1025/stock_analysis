/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { create } from 'zustand';

export interface Goal {
  id: string;
  goalType: 'retirement' | 'house' | 'education' | 'emergency' | 'custom';
  title: string;
  targetAmount: number;
  currentProgress: number;
  targetDate: string;
  expectedCagr: number;
}

interface GoalState {
  goals: Goal[];
  selectedGoal: Goal | null;
  setGoals: (goals: Goal[]) => void;
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, data: Partial<Goal>) => void;
  removeGoal: (id: string) => void;
  setSelectedGoal: (goal: Goal | null) => void;
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  selectedGoal: null,
  setGoals: (goals) => set({ goals }),
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  updateGoal: (id, data) => set((state) => ({
    goals: state.goals.map((g) => g.id === id ? { ...g, ...data } : g)
  })),
  removeGoal: (id) => set((state) => ({
    goals: state.goals.filter((g) => g.id !== id)
  })),
  setSelectedGoal: (selectedGoal) => set({ selectedGoal })
}));
