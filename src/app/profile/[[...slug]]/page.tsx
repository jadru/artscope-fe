import Image from 'next/image';
import React from 'react';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';

import { profileApiType } from '@/types';

const fetchProfile = async (username: string) =>
  fetch(NEXT_PUBLIC_API_URL + '/api/members/' + username).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  });

export default async function ProfilePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const data: profileApiType = await fetchProfile(params.slug[0]);
  return (
    <div className='text-md flex w-full flex-col items-center justify-center py-4 text-center font-serif'>
      <>
        <Image
          src={data.picture || '/images/default-profile.png'}
          alt='profile picture'
          className='rounded-full'
          width={100}
          height={100}
        />
        <h1 className='text-md text-center font-light'>{data.name}</h1>
        <h2 className='mb-4 text-center text-sm font-bold'>{data.username}</h2>
        <h3 className='text-xl font-normal'>
          {data.introduction || 'ㅇㅇㅇ의 소개입니다.'}
          {data.history || 'ㅇㅇㅇ의 경력입니다.'}
          {data.websiteUrl || 'https://www.artscope.kr/'}
          {data.snsUrl || 'https://www.artscope.kr/'}
        </h3>
        {data.email}
        {data.artistStatus}
        {String(data.authrities)}
        {data.createdTime}
        {data.updatedTime}
        {data.oauthProvider}
      </>
    </div>
  );
}
