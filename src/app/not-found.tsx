'use client';

import Link from 'next/link';
import * as React from 'react';
import { RiAlarmWarningFill } from 'react-icons/ri';

import Footer from '@/components/Footer';
import Seo from '@/components/Seo';
import TabLayout from '@/components/TabLayout';
import BottomBar from '@/components/TabLayout/BottomBar';
import { NavBar } from '@/components/TabLayout/NavBar';

export default function NotFoundPage() {
  return (
    <>
      <Seo templateTitle='Not:Found' />
      <NavBar />
      <TabLayout>
        <div className='layout flex min-h-screen flex-col items-center justify-center text-center text-black dark:text-gray-200'>
          <RiAlarmWarningFill
            size={60}
            className='drop-shadow-glow animate-flicker text-red-500'
          />
          <h1 className='mt-8 text-4xl md:text-6xl'>
            페이지를 찾을 수 없습니다
          </h1>
          <Link className='link mb-8 mt-4 md:text-lg' href='/'>
            홈으로 돌아가기
          </Link>
          <Footer />
        </div>
      </TabLayout>
      <BottomBar tab='artwork' />
      <Footer />
    </>
  );
}
