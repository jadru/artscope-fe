import React from 'react';

import EditorNavbar from '@/app/editor/(dashboard)/EditorNavbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col w-full min-h-screen h-auto'>
      <header className='flex items-center h-16 px-4 border-b shrink-0 md:px-6'>
        <EditorNavbar />
      </header>
      <main className='flex flex-1 flex-col p-4 md:p-6 min-h-[100vh-4rem]]'>
        {children}
      </main>
    </div>
  );
}
