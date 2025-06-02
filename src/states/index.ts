import { create } from 'zustand';

import { profileApiResponseType } from '@/types/profile';

type userType = {
  user: profileApiResponseType | undefined;
  // eslint-disable-next-line no-unused-vars
  setUser: (user: profileApiResponseType | undefined) => void;
  clearUser: () => void;
  setNotLogin: () => void;
  setAdmin: () => void;
  isLogin: boolean | undefined;
  isAdmin: boolean | undefined;
};
export const useUser = create<userType>((set) => ({
  user: undefined,
  setUser: (user: profileApiResponseType | undefined) =>
    set({ user, isLogin: !!user, isAdmin: user?.username === 'admin' }),
  clearUser: () => set({ user: undefined, isLogin: false }),
  setNotLogin: () => set({ isLogin: false }),
  setAdmin: () => set({ isAdmin: true }),
  isLogin: undefined,
  isAdmin: undefined,
}));
