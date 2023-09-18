import { create } from 'zustand';

import { roleType } from '@/types';

type user = {
  name: string | undefined;
  username: string | undefined;
  profilePicture: string | undefined;
  email: string | undefined;
  oauthProvider?: undefined | 'google' | 'naver';
  role: roleType;
};

type UserStoreType = {
  user: user;
  setUser: (user: user) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
};

export const userStore = create<UserStoreType>((set) => ({
  user: {
    name: undefined,
    username: undefined,
    profilePicture: undefined,
    email: undefined,
    oauthProvider: undefined,
    role: [],
  },
  setUser: (user) => set({ user }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
