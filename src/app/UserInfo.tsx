'use client';

import { User } from '@nextui-org/react';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import { useUser } from '@/states';

export default function UserInfo() {
  const { user } = useUser();
  return user ? (
    <User
      name={user.name}
      description={`@${user.username?.slice(0, 12)}`}
      avatarProps={{
        src:
          (user.picture?.startsWith('http')
            ? user.picture
            : NEXT_PUBLIC_MEDIA_STORAGE_URL + '/' + user.picture) || '',
        color: 'secondary',
      }}
      className='p-1'
    />
  ) : (
    <></>
  );
}
