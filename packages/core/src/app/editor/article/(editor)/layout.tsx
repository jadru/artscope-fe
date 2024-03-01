import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container relative mx-auto px-0 min-h-screen max-w-screen-md overscroll-none bg-white md:border-x'>
      {children}
    </div>
  );
}
