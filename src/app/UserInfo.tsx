'use client';

import { User } from '@nextui-org/react';

import useUser from '@/hooks/useUser';

export default function UserInfo() {
  const user = useUser();
  return user ? (
    <User
      name={user.name}
      description={`@${user.username?.slice(0, 12)}`}
      avatarProps={{
        src: user.picture || '',
        color: 'secondary',
      }}
      className='p-1'
    />
  ) : (
    <></>
  );
}
