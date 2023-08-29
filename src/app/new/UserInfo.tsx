'use client';

import { User } from '@nextui-org/react';

export default function UserInfo() {
  return (
    <User
      name='박영건'
      description='@jadru'
      avatarProps={{
        src: 'https://avatars.githubusercontent.com/u/29701385?v=4',
      }}
      className='p-1'
    />
  );
}
