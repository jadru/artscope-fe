'use client';

import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import useAuth from '@/hooks/useAuth';

import Footer from '@/components/Footer';
import ProfileCard from '@/components/ProfileCard';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

import { profile } from '@/api';
import { isTokenLoadingAtom, userNameAndRoleAtom } from '@/states/atom';

import { profileApiType } from '@/types';

async function getProfile(slug: string) {
  const { data } = await profile.get(slug);
  return data;
}
const Page = () => {
  const params = useParams();
  const [profileData, setProfileData] = useState<profileApiType | null>(null);
  useAuth();
  const isTokenLoading = useRecoilValue(isTokenLoadingAtom);
  const usernameAndRole = useRecoilValue(userNameAndRoleAtom);

  useEffect(() => {
    !profileData &&
      getProfile(params.slug[0]).then((res) => {
        setProfileData(res);
      });
  }, [profileData, params.slug]);

  return (
    <>
      <Seo templateTitle='artistname' />
      <NavBar />
      <TabLayout>
        {profileData && (
          <ProfileCard
            profileData={profileData}
            editable={
              !isTokenLoading &&
              profileData.username === usernameAndRole.username
            }
          />
        )}
      </TabLayout>
      <Footer />
      <BottomBar tab='profile' />
    </>
  );
};

export default Page;
