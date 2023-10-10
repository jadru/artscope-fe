import { create } from 'zustand';

import { profileApiResponseType } from '@/types';

type userType = {
  user: profileApiResponseType | undefined;
  setUser: (user: profileApiResponseType) => void;
  isLogin: boolean;
};
export const useUser = create<userType>((set) => ({
  user: undefined,
  setUser: (user: profileApiResponseType) => set({ user, isLogin: true }),
  isLogin: false,
}));
