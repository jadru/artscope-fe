import { atom } from 'recoil';

export const isTokenLoadingAtom = atom<boolean>({
  key: 'isTokenLoadingAtom',
  default: false,
});
