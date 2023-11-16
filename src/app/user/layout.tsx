import { Metadata } from 'next';
import React from 'react';

import Navbar from '@/components/Navbar';

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
      <Navbar theme='light' />
      <div className='mx-auto flex max-w-md flex-col items-stretch gap-2 p-4'>
        {children}
      </div>
    </>
  );
}
