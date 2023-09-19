import Image from 'next/image';

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
    <div className='text-md flex w-full flex-col items-center justify-center bg-orange-50 py-4 text-center font-serif'>
      <Image
        src={data.picture}
        alt='profile picture'
        className='rounded-full'
        width={200}
        height={200}
      />
      <h1 className='text-md text-center font-light '>{data.name}</h1>
      <h3 className='text-4xl font-semibold'>{data.introduction}</h3>
      {data.history}
      {data.websiteUrl}
      {data.snsUrl}
    </div>
  );
}
