import jwt_decode from 'jwt-decode';
import Lottie from 'lottie-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import ProfileAnimation from 'public/animation/8020-profile.json';
import React, { useMemo } from 'react';
import { Cookies } from 'react-cookie';
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

  const cookies = useMemo(() => new Cookies(), []);
  const { push } = useRouter();
  const handleLogout = () => {
    jxios.post('/api/logout').then(() => {
      cookies.remove('refreshToken');
      jxios.defaults.headers.common['Authorization'] = undefined;
      push('/').then(() => toast.success('로그아웃 되었습니다.'));
    });
  };

  if (profileError) return <div>failed to load</div>;
  if (profileLoading) {
    return <div>loading...</div>;
  } else {
    return (
      profileData && (
        <>
          <Seo templateTitle='Profile' />
          <TabLayout>
            <div className='flex w-full flex-col items-center justify-center space-y-2 text-center'>
              <div className='card flex w-[300px] flex-row justify-between bg-white/60 px-8 py-6 drop-shadow-2xl'>
                <div className='avatar'>
                  <div className='ring-primary w-24 rounded-full bg-white/50 ring ring-offset-2 ring-offset-base-100'>
                    {profileData.picture ? (
                      <Image
                        src={profileData.picture}
                        alt='profile'
                        width={200}
                        height={200}
                      />
                    ) : (
                      <Lottie
                        animationData={ProfileAnimation}
                        className='h-24 w-24'
                      />
                    )}
                  </div>
                </div>
                <div className='flex flex-col justify-center pr-4 text-black'>
                  <p className='text-2xl font-bold'>{profileData.name}</p>
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
              <button className='btn-ghost btn' onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          </TabLayout>
          <BottomBar tab='profile' />
        </>
      )
    );
  }
};

export default Profile;
