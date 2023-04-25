import { atom } from 'recoil';
import { v4 } from 'uuid';

export const isTokenLoadingAtom = atom<boolean>({
  key: 'isTokenLoadingAtom' + v4(),
  default: false,
});

export const userNameAndRoleAtom = atom<{
  username: string | undefined;
  role: string | undefined;
}>({
  key: 'userNameAndRoleAtom' + v4(),
  default: { username: undefined, role: undefined },
});
