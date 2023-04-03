import { atom } from 'recoil';

export const tokenAtom = atom<string | undefined>({
  key: 'token',
  default: undefined,
});
