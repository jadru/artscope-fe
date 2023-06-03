import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import React from 'react';
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

import { generalProfileApiType } from '@/types';

export const getServerSideProps: GetServerSideProps<{
  data: generalProfileApiType;
}> = async ({ params }) => {
  if (!params?.slug) return { notFound: true };
  const { data, status } = await profile.get(params.slug as string);
  if (!data || status === 400) return { notFound: true };
  return { props: { data } };
};
const Slug = ({
  data: profileData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  useAuth();
  const isTokenLoading = useRecoilValue(isTokenLoadingAtom);
  const usernameAndRole = useRecoilValue(userNameAndRoleAtom);

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

export default Slug;
