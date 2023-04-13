import { atom } from 'recoil';
import { v4 } from 'uuid';

export const isTokenLoadingAtom = atom<boolean>({
  key: 'isTokenLoadingAtom' + v4(),
  default: false,
});
