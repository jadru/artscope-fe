'use client';

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React from 'react';
import { AiOutlineForm } from 'react-icons/ai';
import { BiPen, BiSearch } from 'react-icons/bi';

import ASNextImage from '@/components/ASNextImage';
import LoginModal from '@/components/Navbar/LoginModalButton';
import { menuItems } from '@/components/Navbar/Menus';

import Logo from '@/assets/images/logo_long.svg';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import { useUser } from '@/states';

export default function Navbar({ theme }: { theme: 'light' | 'dark' }) {
  const { user, isLogin } = useUser();
  const { push } = useRouter();
  const pathname = usePathname();
  const _theme = theme;

  const ProfileDropdown = () =>
    user ? (
      <Dropdown placement='bottom'>
        <DropdownTrigger>
          <button>
            <ASNextImage
              className='h-10 w-10 transform rounded-lg border-1.5 border-default-700 object-cover transition-transform hover:scale-105 hover:border-primary'
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
          }}
        >
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

  const NewContentDropdown = () => {
    if (user?.roleStatus === 'NONE' || user?.roleStatus === undefined)
      return (
        <button
          className='bg flex h-10 w-20 items-center justify-center gap-1 rounded-lg border-default-700 text-default-700 hover:bg-default-100'
          onClick={() => push('/user/apply')}
        >
          <BiPen size={23} />
          <p className='pt-0.5'>정보 입력</p>
        </button>
      );
    else
      return (
        <Dropdown placement='bottom'>
          <DropdownTrigger>
            <button className='bg flex h-10 w-20 items-center justify-center gap-1 rounded-lg border-default-700 text-default-700 hover:bg-default-100'>
              <AiOutlineForm size={23} />
              <p className='pt-0.5'>작성</p>
            </button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label='Profile Actions'
            variant='flat'
            onAction={(key) => {
              push(key as string);
            }}
          >
            <DropdownItem key='/new/post'>새 포스트</DropdownItem>
            <DropdownItem key='/new/artwork'>새 작품</DropdownItem>
            <DropdownItem key='/new/event'>새 이벤트</DropdownItem>
            <DropdownItem key='/new/agora'>새 아고라</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
  };

  return (
    <>
      <div className='sticky -top-12 z-50 w-screen bg-white/80 backdrop-blur-2xl transition md:top-0'>
        <div className='mx-auto flex max-w-[1024px] flex-col items-start justify-between px-2.5 lg:px-0'>
          <Link
            className='group box-border flex h-12 basis-0 cursor-pointer appearance-none flex-row flex-nowrap items-end justify-start whitespace-nowrap bg-transparent text-medium no-underline md:hidden'
            href='/'
          >
            <Logo className='h-12 w-32 overflow-hidden fill-black px-2 pb-0 pt-2 transition duration-100' />
          </Link>
          <div className='flex h-14 w-full items-center justify-between'>
            <div className='flex items-center justify-center gap-0.5 py-2 md:hidden md:gap-1'>
              {menuItems.map((item, index) => (
                <Link
                  href={item.url}
                  key={`${item.name}-${index}`}
                  className={`px-1 py-2 font-bold decoration-2 underline-offset-4 transition hover:underline md:px-2 ${
                    index === 0
                      ? pathname === '/'
                        ? 'underline'
                        : ''
                      : pathname.startsWith(item.slug)
                      ? 'underline'
                      : ''
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              <Link
                href='/search'
                key='search'
                className={`px-2 py-2 font-bold decoration-2 underline-offset-4 transition hover:underline ${
                  pathname.startsWith('/search') ? 'text-indigo-700' : ''
                }`}
              >
                <BiSearch size={17} className='mt-0.5 stroke-1' />
              </Link>
            </div>
            <Link
              href='/'
              className='group box-border hidden h-10 basis-0 cursor-pointer appearance-none flex-row flex-nowrap items-end justify-start whitespace-nowrap bg-transparent text-medium no-underline md:flex'
            >
              <Logo className='h-10 w-32 overflow-hidden fill-black px-2 pb-1 pt-1 transition duration-100 group-hover:fill-primary' />
            </Link>
            <div className='flex gap-1.5'>
              {isLogin === undefined ? (
                <div className='h-1 w-1'></div>
              ) : !isLogin ? (
                <LoginModal
                  btnText='시작하기'
                  title='로그인 / 회원가입'
                  link={NEXT_PUBLIC_API_URL + '/oauth2/authorization/google'}
                />
              ) : (
                <>
                  <NewContentDropdown />
                  <ProfileDropdown />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
