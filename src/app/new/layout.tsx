import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='container relative mx-auto min-h-screen max-w-[720px] overscroll-none bg-white'>
      {children}
    </div>
  );
}
