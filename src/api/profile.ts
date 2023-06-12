import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtistForm } from '@/types/artist';

const getProfileData = (id: string) =>
  jxios.get(`${NEXT_PUBLIC_API_URL}/api/members/${id}`);

const ArtistInfo = (data: ArtistForm) =>
  jxios.post('/api/members/artist', data);

const getMyProfileData = () => jxios.get('/api/members/profile');
export const profile = {
  get: getProfileData,
  input: ArtistInfo,
  my: getMyProfileData,
};
