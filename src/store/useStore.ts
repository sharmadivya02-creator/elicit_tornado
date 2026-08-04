import { create } from 'zustand';

interface State {
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;
}

export const useStore = create<State>((set) => ({
  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),
}));