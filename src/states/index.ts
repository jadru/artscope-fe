import { create } from 'zustand';

import { profileApiResponseType } from '@/types';

type userType = {
  user: profileApiResponseType;
  setUser: (user: profileApiResponseType) => void;
  clearUser: () => void;
  setNotLogin: () => void;
  isLogin: boolean | undefined;
};
export const useUser = create<userType>((set) => ({
  user: {
    artistStatus: 'NONE',
    createdTime: new Date(),
    email: '',
    oauthProvider: null,
    history: '',
    introduction: '',
    activated: true,
    name: '',
    picture: '',
    snsUrl: '',
    username: '',
    websiteUrl: '',
  },
  setUser: (user: profileApiResponseType) => set({ user, isLogin: true }),
  clearUser: () => set({ user: undefined, isLogin: false }),
  setNotLogin: () => set({ isLogin: false }),
  isLogin: undefined,
}));
