import React from 'react';

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='mx-auto flex max-w-md flex-col items-stretch gap-2 p-4'>
      {children}
    </div>
  );
}
