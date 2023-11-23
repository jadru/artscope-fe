import { Metadata } from 'next';
import React from 'react';

import MainNavigation from '@/app/(main)/(list)/(feed)/MainNavigation';

export const metadata: Metadata = {
  title: 'Search',
  description: '예술 작품, 포스트 등 궁금한 것을 검색하세요.',
  openGraph: {
    title: 'Search',
    description: '예술 작품, 포스트 등 궁금한 것을 검색하세요.',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className=' mx-auto flex justify-center '>
      <div className='flex w-full max-w-screen-sm md:max-w-screen-lg lg:max-w-screen-xl'>
        <div className='sticky top-11 h-max md:w-44 lg:w-52'>
          <MainNavigation />
        </div>
        <div className='w-full md:w-[calc(100%-11rem)] lg:w-[calc(100%-13rem)]'>
          {children}
        </div>
      </div>
    </div>
  );
}
