import { atom } from 'recoil';

import { decodedTokenType } from '@/types';

export const tokenAtom = atom<string | undefined>({
  key: 'token',
  default: undefined,
});

export const decodedTokenAtom = atom<decodedTokenType | undefined>({
  key: 'decodedToken',
  default: undefined,
});
