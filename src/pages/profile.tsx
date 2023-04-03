import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { useRecoilValue } from 'recoil';

import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';

import { tokenAtom } from '@/states/atoms';

const Profile = () => {
  const token = useRecoilValue(tokenAtom);
  const { push } = useRouter();

  useEffect(() => {
    if (!token) {
      push('/login').then(() => toast.warn('로그인이 필요합니다.'));
    }
  }, [token, push]);
  return (
    <>
      <Seo templateTitle='Profile' />
      <TabLayout>
        <p>준비중</p>
      </TabLayout>
      <BottomBar tab='profile' />
    </>
  );
};

export default Profile;
