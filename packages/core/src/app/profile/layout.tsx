import React, { Suspense } from 'react';

import Navbar from '@/components/Navbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='p-0 m-0 min-h-screen pt-24 bg-[#F2EBD7]'>
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <Navbar light={false} />
    </div>
  );
}
