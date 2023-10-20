import { create } from 'zustand';

import { profileApiResponseType } from '@/types/profile';

type userType = {
  user: profileApiResponseType | undefined;
  setUser: (user: profileApiResponseType | undefined) => void;
  clearUser: () => void;
  setNotLogin: () => void;
  isLogin: boolean | undefined;
};
export const useUser = create<userType>((set) => ({
  user: undefined,
  setUser: (user: profileApiResponseType | undefined) =>
    set({ user, isLogin: user !== undefined }),
  clearUser: () => set({ user: undefined, isLogin: false }),
  setNotLogin: () => set({ isLogin: false }),
  isLogin: undefined,
}));
