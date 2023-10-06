import { create } from 'zustand';

import { userCookieType } from '@/utils/auth';

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

type userType = {
  user: userCookieType | undefined;
  setUser: (user: userCookieType) => void;
  isLogin: boolean;
};
export const useUser = create<userType>((set) => ({
  user: undefined,
  setUser: (user: userCookieType) => set({ user, isLogin: true }),
  isLogin: false,
}));
