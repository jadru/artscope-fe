import React from 'react';

import Footer from '@/components/Footer';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <div className='container p-0 m-0 min-h-screen max-w-screen-xl'>
        {children}
      </div>
      <Footer />
    </div>
  );
}
