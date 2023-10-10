import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';

import { profileApiType } from '@/types';

const fetchProfile = async (username: string) =>
  await fetch(NEXT_PUBLIC_API_URL + '/api/members/' + username, {
    headers: { accept: '*/*' },
  }).then((res) => {
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    return res.json();
  });

export default async function ProfilePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const data: profileApiType = await fetchProfile(params.slug[0]);
  // when string data.history meets /n, make <br/>component on array
  const history = data.history?.split('\n').map((line, index) => (
    <>
      <h3
        key={'line-' + index}
        className='cursor-text px-2.5 py-2 text-xl font-normal hover:bg-stone-900/10'
      >
        {line}
      </h3>
      {data.history?.length > index && <hr />}
    </>
  ));

  return (
    <div className='mx-auto my-14 max-w-4xl space-y-3 px-4'>
      <div className='flex w-full items-center justify-between py-4'>
        <div className='space-y-4'>
          <h1 className='font-serif text-4xl'>{data.name}</h1>
          <h2 className='text-2xl'>@{data.username}</h2>
        </div>
        <Image
          src={data.picture || 'images/default-profile.png'}
          alt='profile picture'
          className='rounded-3xl drop-shadow-xl'
          width={180}
          height={180}
        />
      </div>
      {data.introduction && (
        <>
          <hr className='h-1 bg-black' />
          <h2 className='mb-4 px-2.5 text-xl'>{data.introduction}</h2>
          <hr className='h-1 bg-black' />
        </>
      )}
      {history && (
        <>
          <h3 className='px-2.5'>이력</h3>
          <div>{history.map((item) => item)}</div>
          <hr className='h-1 bg-black' />
        </>
      )}
      <div className='flex flex-col'>
        {data.websiteUrl && (
          <>
            <h3 className='px-2.5'>웹사이트 & SNS</h3>
            <Link href={data.websiteUrl}>
              <h4 className='cursor-pointer px-2.5 py-2 text-lg font-bold hover:bg-stone-900/10'>
                {data.websiteUrl}
              </h4>
            </Link>
          </>
        )}
        {data.websiteUrl && data.snsUrl && <hr />}
        {data.snsUrl && (
          <Link href={data.snsUrl}>
            <h4 className='cursor-pointer px-2.5 py-2 text-lg font-bold hover:bg-stone-900/10'>
              {data.snsUrl}
            </h4>
          </Link>
        )}
      </div>
    </div>
  );
}
