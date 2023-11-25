import React from 'react';

import NavBar from '@/components/Navbar';

import MainNavigation from '@/app/(main)/(list)/(feed)/MainNavigation';
import SidebarWidget from '@/app/(main)/(list)/(feed)/SidebarWidget';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavBar theme='light' />
      <div className='container mx-auto min-h-[calc(100vh-144px)] max-w-screen-lg'>
        <div className='mx-auto flex justify-center'>
          <div className='mt-auto flex w-full max-w-screen-sm md:max-w-screen-lg lg:max-w-screen-xl'>
            <div className='sticky top-14 h-max md:w-44 lg:w-52'>
              <MainNavigation />
            </div>
            <div className='w-full md:w-[calc(100%-26rem)] lg:w-[calc(100%-33rem)]'>
              {children}
            </div>
            <div className='relative hidden min-h-max flex-col px-2 md:flex md:w-60 lg:w-80'>
              <SidebarWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
