import Link from 'next/link';
import React from 'react';
import { AiOutlineHome, AiOutlineLink } from 'react-icons/ai';

import ASNextImage from '@/components/ASNextImage';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { profileApiType } from '@/types/profile';

const fetchProfile = async (username: string) =>
  await jxios
    .get(NEXT_PUBLIC_API_URL + '/api/members/' + username)
    .then((res) => {
      if (res.status !== 200) {
        throw new Error(res.statusText);
      }
      return res.data as profileApiType;
    });

export default async function ProfilePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const data = await fetchProfile(params.slug[0]);
  // when string data.history meets /n, make <br/>component on array
  const history = data.history?.split('\n').map((line, index) => {
    if (line === '') {
      return;
    }
    return (
      <div key={'line-' + index}>
        {index === 0 && <hr />}
        <div>
          <h3 className='cursor-text px-2.5 py-2 text-xl font-normal hover:bg-stone-900/10'>
            {line}
          </h3>
          {data.history?.length > index && <hr />}
        </div>
      </div>
    );
  });

  return (
    <div className='mx-auto my-6 max-w-4xl space-y-3 px-4'>
      <div className='flex w-full items-center justify-between py-4'>
        <div className='space-y-4 px-2.5'>
          <h1 className='font-serif text-4xl'>{data.name}</h1>
          <h2 className='text-2xl'>@{data.username}</h2>
        </div>
        {data.picture && (
          <ASNextImage
            src={data.picture}
            alt='profile picture'
            className='h-32 w-32 rounded-3xl border object-cover drop-shadow-xl'
            width={180}
            height={180}
          />
        )}
      </div>
      <hr className='h-0.5 bg-black' />
      {data.introduction && (
        <>
          <h2 className='mb-4 px-2.5 text-xl'>{data.introduction}</h2>
          <hr className='h-0.5 bg-black' />
        </>
      )}
      {history && (
        <>
          <h3 className='px-2.5'>이력</h3>
          <div>{history.map((item) => item)}</div>
          <hr className='h-0.5 bg-black' />
        </>
      )}
      <div className='flex flex-col'>
        {data.websiteUrl && (
          <>
            <h3 className='px-2.5'>웹사이트 & SNS</h3>
            <Link href={data.websiteUrl}>
              <h4 className='cursor-pointer px-2.5 py-2 text-lg font-bold hover:bg-stone-900/10'>
                <AiOutlineHome className='mb-1 mr-1 inline' size={17} />
                {data.websiteUrl}
              </h4>
            </Link>
          </>
        )}
        {data.websiteUrl && data.snsUrl && <hr />}
        {data.snsUrl && (
          <Link href={data.snsUrl}>
            <h4 className='cursor-pointer px-2.5 py-2 text-lg font-bold hover:bg-stone-900/10'>
              <AiOutlineLink className='mb-1 mr-1 inline' size={17} />
              {data.snsUrl}
            </h4>
          </Link>
        )}
      </div>
    </div>
  );
}
