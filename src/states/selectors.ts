import { selector } from 'recoil';

import { tokenAtom } from '@/states/atoms';

export const tokenSelector = selector({
  key: 'tokenSelector',
  get: ({ get }) => {
    const token = get(tokenAtom);
    if (token === undefined) {
      return '';
    } else {
      return 'Bearer ' + token;
    }
  },
  set: ({ set }, newValue) => {
    set(tokenAtom, newValue);
  },
});
