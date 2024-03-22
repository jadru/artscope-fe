'use client';

import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';
import StandardLabel from '@/components/StandardLabel';

export default function ProfileComponent({
  name,
  username,
  picture,
  clickable = true,
  borderTop = false,
  borderBottom = false,
}: {
  username: string;
  name: string;
  picture?: string;
  clickable?: boolean;
  borderTop?: boolean;
  borderBottom?: boolean;
}) {
  return (
    <Link
      className={clickable ? 'cursor-pointer' : 'cursor-default'}
      href={`${clickable ? '/profile/' + username : '#'}`}>
      <div
        className={`
          flex flex-row items-center w-full justify-between transition-colors gap-2 p-6 text-[#1A1A1A] ${
            borderTop
              ? 'border-t-4 border-[#ACB884] hover:border-[#DFA36D]'
              : ''
          } ${borderBottom ? 'border-b-4 border-[#DFA36D]' : ''}`}>
        <div
          className={`ml-0.5 flex flex-col transition ${
            clickable ? 'hover:underline' : ''
          }`}>
          <p className='inline text-2xl font-bold'>
            <StandardLabel label={name} />
          </p>
          <p className='text-default-500 line-clamp-1 text-lg'>@{username}</p>
        </div>
        <ASNextImage
          src={picture ?? 'prod/images/default.jpg'}
          alt='프로필 사진'
          width={64}
          height={64}
          className='h-16 w-16 rounded-full object-cover'
        />
      </div>
    </Link>
  );
}
