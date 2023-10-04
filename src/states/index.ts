import { create } from 'zustand';

type LoadingType = {
  isLoading: boolean;
  setLoading: () => void;
  setLoadingStop: () => void;
};

export const useIsLoading = create<LoadingType>((set) => ({
  isLoading: true,
  setLoading: () => set({ isLoading: true }),
  setLoadingStop: () => set({ isLoading: false }),
}));
