import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { AiOutlineForm } from 'react-icons/ai';
import { BiPen } from 'react-icons/bi';

import { useUser } from '@/states';

export default function NewContentDropdown() {
  const { user } = useUser();
  const { push } = useRouter();
  if (user?.roleStatus === 'NONE' || user?.roleStatus === undefined)
    return (
      <button
        className='bg border-default-700 text-default-700 hover:bg-default-100 flex h-10 w-20 items-center justify-center gap-1 rounded-lg'
        onClick={() => push('/user/apply')}>
        <BiPen size={23} />
        <p className='pt-0.5'>정보 입력</p>
      </button>
    );
  else
    return (
      <Dropdown placement='bottom'>
        <DropdownTrigger>
          <button className='bg border-default-700 text-default-700 hover:bg-default-100 flex h-10 w-20 items-center justify-center gap-1 rounded-lg'>
            <AiOutlineForm size={23} />
            <p className='pt-0.5'>작성</p>
          </button>
        </DropdownTrigger>
        <DropdownMenu
          aria-label='Profile Actions'
          variant='flat'
          onAction={(key) => {
            push(key as string);
          }}>
          <DropdownItem key='/new/post'>새 포스트</DropdownItem>
          <DropdownItem key='/new/artwork'>새 작품</DropdownItem>
          <DropdownItem key='/new/event'>새 이벤트</DropdownItem>
          <DropdownItem key='/new/agora'>새 아고라</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
}
