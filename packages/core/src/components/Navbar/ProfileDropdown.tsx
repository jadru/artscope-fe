import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';

import { useUser } from '@/states';

export default function ProfileDropdown() {
  const { user } = useUser();
  const { push } = useRouter();
  return user ? (
    <Dropdown placement='bottom'>
      <DropdownTrigger>
        <button>
          <ASNextImage
            className='border-1.5 border-default-700 hover:border-primary h-10 w-10 transform rounded-lg object-cover transition-transform hover:scale-105'
            alt={user.name}
            width={32}
            height={32}
            src={user.picture ?? 'prod/images/default.jpg'}
          />
        </button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Profile Actions'
        variant='flat'
        onAction={(key) => {
          switch (key) {
            case 'profile':
              push('/profile/' + user.username);
              break;
            case 'settings':
              push('/user/settings');
              break;
            case 'feedback':
              push('https://forms.gle/F9V9gppnKXXBRE4d6');
              break;
            case 'logout':
              push('/user/signout');
              break;
          }
        }}>
        <DropdownItem key='profile' className='h-14 gap-1'>
          <p className='text-lg font-semibold'>{user.name}</p>
          <p className='font-semibold'>@{user.username}</p>
        </DropdownItem>
        <DropdownItem key='settings'>설정</DropdownItem>
        <DropdownItem key='feedback'>피드백</DropdownItem>
        <DropdownItem key='logout' color='danger'>
          로그아웃
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  ) : (
    <></>
  );
}
