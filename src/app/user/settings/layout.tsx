import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { BiPalette, BiPen, BiUser } from 'react-icons/bi';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Title from '@/components/Title';

export const metadata: Metadata = {
  title: '회원 정보 관리',
  description: '회원 정보 관리 페이지입니다.',
};

export default function DashboardLayout({
  children, // will be a pages or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className='container mx-auto flex min-h-[calc(100vh-10rem)] max-w-screen-xl flex-col md:flex-row items-stretch gap-2 p-2 md:p-4 pb-3'>
        <div className='flex flex-row md:flex-col gap-1 p-2 md:w-1/4 md:h-full'>
          <UserSettingNavigation />
        </div>
        <div className='flex flex-col gap-2 md:w-3/4 p-3'>
          <Title
            title='회원 정보'
            description='회원 정보를 변경할 수 있습니다.'
          />
          {children}
        </div>
      </div>
      <Footer />
    </>
  );
}

const UserSettingNavigation = () => (
  <>
    <Link
      href='/user/settings'
      className='hover:bg-default-100 transition rounded-xl px-3 py-2 flex gap-1'>
      <BiUser size={20} />
      계정 관리
    </Link>
    <Link
      href='/user/settings/profile'
      className='hover:bg-default-100 transition rounded-xl px-3 py-2 flex gap-1'>
      <BiPalette size={20} />
      프로필 관리
    </Link>
    <Link
      href='#'
      className='hover:bg-default-100 transition rounded-xl px-3 py-2 flex gap-1 text-default-300'>
      <BiPen size={20} />
      컨텐츠 관리
    </Link>
  </>
);
