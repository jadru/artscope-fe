import React from 'react';

import Bottombar from '@/components/Bottombar';
import Footer from '@/components/Footer';
import NavBar from '@/components/Navbar';

import MainNavigation from '@/app/(main)/(list)/(feed)/MainNavigation';
import SidebarWidget from '@/app/(main)/(list)/(feed)/SidebarWidget';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavBar />
      <div className='container mx-auto min-h-[calc(100vh-144px)] max-w-screen-xl'>
        <div className='mx-auto flex justify-center'>
          <div className='mt-auto flex w-full max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl'>
            <div className='sticky top-14 h-max md:w-44 lg:w-52 xl:w-64'>
              <MainNavigation />
            </div>
            <div className='w-full md:w-[calc(100%-26rem)] lg:w-[calc(100%-31rem)] xl:w-[calc(100%-36rem)]'>
              {children}
            </div>
            <div className='relative hidden min-h-max flex-col px-2 md:flex md:w-60 lg:w-72 xl:w-80'>
              <SidebarWidget />
            </div>
          </div>
        </div>
      </div>
      <Bottombar />
      <Footer />
    </div>
  );
}
