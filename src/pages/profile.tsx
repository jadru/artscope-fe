import React from 'react';
import { useRecoilValue } from 'recoil';
import useSWR from 'swr';

import useAuth from '@/hooks/useAuth';

import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { isTokenLoadingAtom } from '@/states/atom';
import jxios from '@/utils/jxios';

import { profileApiType } from '@/types';

const Profile = () => {
  useAuth();
  const isTokenLoading = useRecoilValue(isTokenLoadingAtom);
  const fetcher = (url: string) =>
    jxios.get(url, { withCredentials: true }).then((res) => res.data);
  const {
    data: profileData,
    error: profileError,
    isLoading: profileLoading,
  } = useSWR<profileApiType>(
    !isTokenLoading && jxios.defaults.headers.common.Authorization
      ? '/api/members/profile'
      : null,
    fetcher
  );
  return (
    (profileError && <div>failed to load</div>) ||
    (profileLoading && <div>loading...</div>) || (
      <>
        <Seo templateTitle='Profile' />
        <NavBar />
        <TabLayout>
          {profileData && <ProfileCard profileData={profileData} editable />}
        </TabLayout>
        <Footer />
        <BottomBar tab='profile' />
      </>
    )
  );
};

export default Profile;
