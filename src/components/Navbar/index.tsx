'use client';

import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from '@nextui-org/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { AiOutlineClose, AiOutlineForm, AiOutlineMenu } from 'react-icons/ai';

import ASNextImage from '@/components/ASNextImage';
import LoginModal from '@/components/Navbar/LoginModalButton';
import { menuItems } from '@/components/Navbar/Menus';

import Logo from '@/assets/images/logo_long.svg';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import { useUser } from '@/states';

export default function Navbar({ theme }: { theme: 'light' | 'dark' }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLogin } = useUser();
  const { push } = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const ProfileDropdown = () =>
    user ? (
      <Dropdown placement='bottom'>
        <DropdownTrigger>
          <button>
            <ASNextImage
              className='h-10 w-10 transform rounded-lg border-1.5 border-default-700 object-cover transition-transform hover:scale-110 hover:border-primary'
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
                push('https://ad21pifdjli.typeform.com/to/kg4KHrj4');
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

  const NewContentDropdown = () => (
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

  return (
    <>
      <div className='sticky top-0 z-50 w-screen border-b bg-white'>
        <div className='mx-auto flex h-16 max-w-[1024px] items-center justify-between px-4'>
          <div
            className='group box-border w-24 basis-0 cursor-pointer flex-row flex-nowrap items-center justify-start whitespace-nowrap bg-transparent text-medium no-underline'
            onClick={() => push('/')}
          >
            <Logo className='h-20 w-24 overflow-hidden fill-[#22bce0] transition duration-100 group-hover:fill-secondary' />
          </div>
          <div className='fitems-center hidden justify-center gap-3 md:flex'>
            {menuItems.map((item, index) => (
              <Link
                href={item.url}
                key={`${item.name}-${index}`}
                className={`pt-0.5 transition hover:text-default-400 ${
                  index === 0
                    ? pathname === '/'
                      ? theme === 'light'
                        ? 'text-primary'
                        : 'text-secondary'
                      : ''
                    : pathname.startsWith(item.slug)
                    ? theme === 'light'
                      ? 'text-primary'
                      : 'text-secondary'
                    : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className='flex gap-1.5'>
            {!isMobileMenuOpen ? (
              <>
                {isLogin === undefined ? (
                  <></>
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
                <button
                  className='flex h-10 w-10 items-center justify-center rounded-lg border-1.5 border-default-700 text-default-700 hover:bg-default-100 md:hidden'
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <AiOutlineMenu size={23} />
                </button>
              </>
            ) : (
              <button
                className='flex h-10 w-10 items-center justify-center rounded-lg border-1.5 border-default-700 text-default-700 hover:bg-default-100 md:hidden'
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <AiOutlineClose size={23} />
              </button>
            )}
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='fixed left-0 top-0 z-[49] flex h-screen w-screen flex-col items-start justify-center bg-white px-6 py-8 md:hidden'
        >
          <div className='flex flex-col gap-4'>
            {menuItems.map((item, index) => (
              <Link
                key={`${item.name}-${index}`}
                href={item.url}
                className={`flex w-full items-center text-left font-bold transition hover:text-default-400 ${
                  index === 0
                    ? pathname === '/'
                      ? theme === 'light'
                        ? 'text-primary'
                        : 'text-secondary'
                      : ''
                    : pathname.startsWith(item.slug)
                    ? theme === 'light'
                      ? 'text-primary'
                      : 'text-secondary'
                    : ''
                }`}
              >
                {React.createElement(item.icon, {
                  size: 23,
                  className: 'mr-2',
                })}
                <p className='my-1 text-2xl'>{item.name}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </>
  );
}
