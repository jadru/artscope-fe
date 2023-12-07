import { Metadata } from 'next';
import React from 'react';

import Footer from '@/components/Footer';
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
      <Navbar />
      <div className='container mx-auto flex min-h-[calc(100vh-10rem)] max-w-md flex-col items-stretch gap-2 p-4 pb-3'>
        {children}
      </div>
      <Footer />
    </>
  );
}
