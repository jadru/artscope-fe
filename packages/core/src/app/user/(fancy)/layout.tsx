import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';

import Logo from '@/assets/images/logo_long.svg';

export const metadata: Metadata = {
  title: '로그인',
  description: '로그인 페이지입니다.',
};

export default function DashboardLayout({
  children, // will be a pages or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='w-screen md:h-screen flex-col md:flex-row flex'>
      <ASNextImage
        src='https://picsum.photos/1280/720.webp/?grayscale'
        alt='test'
        placeholder='blur'
        blurDataURL={
          'src="data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs='
        }
        width={1280}
        height={720}
        className='absolute top-0 left-0 w-screen h-screen -z-40 object-cover bg-black'
      />
      <div className='md:w-1/2 xl:w-2/3 md:h-screen w-full h-12'>
        <Link
          href='/about'
          className='text-medium group box-border h-10 basis-0 w-full flex cursor-pointer flex-row md:justify-start items-center justify-center whitespace-nowrap bg-transparent no-underline md:flex'>
          <Logo className='group-hover:fill-gray-700 h-14 w-44 overflow-hidden fill-white px-6 pb-1 pt-8 transition duration-100' />
        </Link>
      </div>
      <div className='w-full md:w-1/2 xl:w-1/3 md:h-screen py-6 px-3 md:px-8 md:py-12 max-h-screen h-[calc(100vh-3rem)] overflow-y-auto flex items-start justify-start'>
        <div className='bg-white/80 backdrop-blur-2xl min-h-full w-full rounded-2xl px-4 py-3 lg:px-6 lg:py-6 flex flex-col gap-2 justify-center'>
          {children}
        </div>
      </div>
    </div>
  );
}
