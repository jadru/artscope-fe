import React from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <div className='px-0.5 md:px-0'>{children}</div>;
}
