import Image from 'next/image';
import Link from 'next/link';
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
    <div className='my-10 space-y-3 font-serif'>
      <div className='w-full'>
        <div className='flex w-full justify-between'>
          <div className='space-y-4'>
            <h1 className='text-4xl'>{data.name}</h1>
            <h2 className='mb-4 text-xl'>
              {data.introduction || 'ㅇㅇㅇ의 소개입니다.'}
            </h2>
          </div>
          <Image
            src={data.picture || '/images/default-profile.png'}
            alt='profile picture'
            className='rounded-3xl drop-shadow-xl'
            width={160}
            height={160}
          />
        </div>
        <h3 className='text-xl font-normal'>
          {data.history || 'ㅇㅇㅇ의 경력입니다.'}
        </h3>
        <div className='flex flex-col'>
          <Link href={data.websiteUrl || 'https://www.artscope.kr/'}>
            Website
          </Link>
          <Link href={data.snsUrl || 'https://www.artscope.kr/'}>
            Social Network
          </Link>
        </div>
      </div>
    </div>
  );
}
