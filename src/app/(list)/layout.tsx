import React from 'react';

import Footer from '@/components/Footer';
import NavBar from '@/components/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <NavBar theme='light' />
      <div className='container mx-auto min-h-[calc(100vh-10rem)] max-w-screen-lg'>
        {children}
      </div>
      <Footer />
    </div>
  );
}
