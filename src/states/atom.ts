import { atom } from 'recoil';
import { v1 } from 'uuid';

export const isTokenLoadingAtom = atom<boolean>({
  key: 'isTokenLoadingAtom/' + v1,
  default: false,
});
