'use client';

import { User } from '@nextui-org/react';

import { userStore } from '@/states';

export default function UserInfo() {
  const { user } = userStore();
  return (
    <User
      name={user.name}
      description={`@${user.username}`}
      avatarProps={{
        src: user.profilePicture,
        color: 'secondary',
      }}
      className='p-1'
    />
  );
}
