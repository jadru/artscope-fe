import { Router } from 'next/router';
import { toast } from 'react-toastify';

import jxios from '@/utils/jxios';

import { profileApiResponseType } from '@/types';

export const onSuccess = async (username: string, router: Router) => {
  const profile: profileApiResponseType = await jxios
    .get(`/api/members/profile`)
    .then((res) => res.data);
  if (profile.artistStatus === 'NONE') {
    toast('작가님의 정보를 입력해주세요.');
    await router.push(`/user/apply`);
  }
};
