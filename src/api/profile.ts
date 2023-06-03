import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { ArtistForm } from '@/types/artist';

const getProfileData = async (id: string) =>
  jxios.get(`${NEXT_PUBLIC_API_URL}/api/members/${id}`);

const ArtistInfo = (data: ArtistForm) => jxios.post('/api/artist', data);

export const profile = {
  get: getProfileData,
  input: ArtistInfo,
};
