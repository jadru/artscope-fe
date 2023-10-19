'use client';

import ASNextImage from '@/components/ASNextImage';

import { useUser } from '@/states';

export default function UserInfo() {
  const { user } = useUser();
  return user ? (
    <div className='flex flex-col items-center justify-center'>
      <ASNextImage
        src={user.picture || ''}
        alt='프로필 사진'
        width={24}
        height={24}
        className='h-12 w-12 rounded-full object-cover'
      />
    </div>
  ) : (
    <></>
  );
}
