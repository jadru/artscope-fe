'use client';

import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';
import StandardLabel, { standardLabel } from '@/components/StandardLabel';

export default function ProfileComponent({
  name,
  username,
  picture,
  introduction,
}: {
  username: string;
  name: string;
  picture?: string;
  introduction?: string;
}) {
  return (
    <Link className='cursor-pointer p-0' href={`/profile/${username}`}>
      <div className='flex flex-row items-start justify-start gap-2 p-3 transition hover:underline'>
        <ASNextImage
          src={picture ?? 'prod/images/default.jpg'}
          alt='프로필 사진'
          width={40}
          height={40}
          className='h-10 w-10 rounded-full border object-cover'
        />
        <div className='ml-0.5 flex flex-col transition hover:underline'>
          <p className='inline text-[0.9rem] font-bold'>
            <StandardLabel label={name} />
          </p>
          <p className='line-clamp-1 text-[0.9rem] text-default-500'>
            @{username}
            {introduction ? ' • ' + standardLabel(introduction) : ''}
          </p>
        </div>
      </div>
    </Link>
  );
}
