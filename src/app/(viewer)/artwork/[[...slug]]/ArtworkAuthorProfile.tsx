'use client';

import { useRouter } from 'next/navigation';

import ASNextImage from '@/components/ASNextImage';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';

import { profileApiResponseType } from '@/types/profile';

export default function ArtworkAuthorProfile({
  author,
}: {
  author: profileApiResponseType;
}) {
  const { push } = useRouter();
  return (
    <div
      className='mx-2 flex cursor-pointer flex-row items-center justify-between rounded-2xl border border-white bg-white px-3 py-3 text-default-900 transition-colors duration-100 hover:border-default-400 hover:bg-default-100 hover:text-default-700'
      onClick={() => push('/profile/' + author.username)}
    >
      <div className='flex flex-col items-start justify-center'>
        <p className='text-lg font-bold'>{author.name} 작가</p>
        <p className='text-sm'>@{author.username}</p>
      </div>
      {author.picture && (
        <ASNextImage
          src={
            author.picture.startsWith('http')
              ? author.picture
              : NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + author.picture
          }
          alt={author.name + "'s profile image"}
          width={60}
          height={60}
          className='rounded-full'
        />
      )}
    </div>
  );
}
