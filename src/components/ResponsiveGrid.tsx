import React from 'react';

export default function ResponsiveGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='mx-2 grid grid-cols-1 gap-1 py-1 md:mx-0 md:grid-cols-3 md:gap-2.5 md:py-4'>
      {children}
    </div>
  );
}
