import Image from 'next/image';
import React from 'react';
import { toast } from 'react-toastify';
import useSWR from 'swr';

import ResponsiveGrid from '@/components/Grid/ResponsiveGrid';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';

import jxios from '@/utils/jxios';

const Profile = () => {
  const fetcher = (url: string) =>
    jxios
      .get(url)
      .then((res) => res.data)
      .catch(() => toast.error('프로필을 불러오는데 실패했습니다.'));
  const { data, error, isLoading } = useSWR('/api/members/profile', fetcher);

  if (error) return <div>failed to load</div>;
  if (isLoading) return <div>loading...</div>;
  return (
    <>
      <Seo templateTitle='Profile' />
      <TabLayout>
        <div className='flex w-full max-w-2xl flex-col items-center space-y-2'>
          <div className='flex flex-row'>
            <div className='avatar'>
              <div className='ring-primary w-24 rounded-full ring ring-offset-2 ring-offset-base-100'>
                <Image
                  src='/images/profile_timcook.jpeg'
                  alt='profile'
                  width={200}
                  height={200}
                />
              </div>
            </div>
            <div className='flex flex-col'>
              <p>누구누구누구</p>
              <p>@asdfasdf</p>
            </div>
          </div>
          <div>
            <p>{data}</p>
            <p>asdfasdffdassdfafdsafasd</p>
          </div>
          <ResponsiveGrid>
            {Array.from({ length: 40 }).map((value, index) => (
              <div className='rounded-md bg-orange-400 p-16' key={index + '_'}>
                <p className='text-white'>{index + 1}</p>
              </div>
            ))}
          </ResponsiveGrid>
        </div>
      </TabLayout>
      <BottomBar tab='profile' />
    </>
  );
};

export default Profile;
