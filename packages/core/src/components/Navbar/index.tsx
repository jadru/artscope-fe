'use client';

import Link from 'next/link';
import React from 'react';

import LoginModal from '@/components/Navbar/LoginModalButton';
import NewContentDropdown from '@/components/Navbar/NewContentDropdown';
import ProfileDropdown from '@/components/Navbar/ProfileDropdown';

import Logo from '@/assets/images/logo_long.svg';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import { useUser } from '@/states';

export default function Navbar() {
  const { isLogin } = useUser();

  return (
    <>
      <div className='md:sticky top-0 z-50 w-screen bg-white/80 backdrop-blur-2xl transition'>
        <div className='mx-auto flex max-w-screen-sm flex-col items-start justify-between px-2.5 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl'>
          <div className='flex h-14 w-full items-center justify-between'>
            <Link
              href='/'
              className='text-medium group box-border h-10 basis-0 cursor-pointer flex-row items-center flex-nowrap  justify-start whitespace-nowrap bg-transparent no-underline flex'>
              <Logo className='group-hover:fill-primary w-28 overflow-hidden fill-black px-2 pb-1 pt-1 transition duration-100' />
            </Link>
            <div className='flex gap-1.5'>
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
      </div>
    </>
  );
}
