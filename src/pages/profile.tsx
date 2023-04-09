import jwt_decode from 'jwt-decode';
import Image from 'next/image';
import React from 'react';
import { AiFillSafetyCertificate } from 'react-icons/ai';
import { HiOutlineDocumentSearch } from 'react-icons/hi';
import { toast } from 'react-toastify';
import useSWR from 'swr';

import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';

import jxios from '@/utils/jxios';

import { profileApiType } from '@/types';

const Profile = () => {
  const decodedToken: { sub: string } | string = jxios.defaults.headers.common
    .Authorization
    ? jwt_decode(jxios.defaults.headers.common.Authorization as string)
    : '';
  const fetcher = (url: string) =>
    jxios
      .get(url)
      .then((res) => res.data)
      .catch(() => toast.error('프로필을 불러오는데 실패했습니다.'));
  const {
    data: profileData,
    error: profileError,
    isLoading: profileLoading,
  } = useSWR<profileApiType>('/api/members/profile', fetcher);
  // const {
  //   data: profileartworkData,
  //   error: profileartworkError,
  //   isLoading: profileartworkLoading,
  // } = useSWR('/api/members/profile/' + decodedToken.sub, fetcher);

  if (profileError) return <div>failed to load</div>;
  if (profileLoading) {
    return <div>loading...</div>;
  } else {
    return (
      profileData && (
        <>
          <Seo templateTitle='Profile' />
          <TabLayout>
            <div className='flex w-full max-w-2xl flex-col items-center space-y-2'>
              <div className='flex flex-row'>
                <div className='avatar'>
                  <div className='ring-primary w-24 rounded-full ring ring-offset-2 ring-offset-base-100'>
                    <Image
                      src={profileData.picture || '/images/profile.png'}
                      alt='profile'
                      width={200}
                      height={200}
                    />
                  </div>
                </div>
                <div className='flex flex-col'>
                  <p>{profileData.name}</p>
                  <p>
                    <>
                      @{decodedToken?.sub}{' '}
                      {(profileData.artistStatus === 'APPROVED' && (
                        <AiFillSafetyCertificate className='h-2 w-2' />
                      )) ||
                        (profileData.artistStatus === 'PENDING' && (
                          <HiOutlineDocumentSearch className='h-2 w-2' />
                        ))}
                    </>
                  </p>
                </div>
              </div>
              <div>
                <p>{profileData.introduction}</p>
                <p>{profileData.history}</p>
              </div>
            </div>
          </TabLayout>
          <BottomBar tab='profile' />
        </>
      )
    );
  }
};

export default Profile;
