import React from 'react';

import EditorNavbar from '@/app/editor/(editor)/EditorNavbar';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col w-full min-h-screen'>
      <header className='flex items-center h-16 px-4 border-b shrink-0 md:px-6'>
        <EditorNavbar />
      </header>
      <main className='flex flex-1 flex-col p-4 md:p-6'>{children}</main>
    </div>
  );
}
