'use client';

import ASNextImage from '@/components/ASNextImage';

import { useUser } from '@/states';

export default function UserInfo() {
  const { user } = useUser();
  return user ? (
    <div className='flex flex-col items-center justify-center'>
      <ASNextImage
        src={user.picture ?? 'prod/images/default.jpg'}
        alt='프로필 사진'
        width={48}
        height={48}
        className='border-default-400 h-12 w-12 rounded-full border object-cover'
      />
    </div>
  ) : (
    <></>
  );
}
