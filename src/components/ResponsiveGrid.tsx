import React from 'react';

export default function ResponsiveGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='mx-4 my-2 grid grid-cols-1 gap-2 py-1 md:mx-0 md:my-0 md:grid-cols-2 md:gap-2.5 md:py-4 lg:grid-cols-3'>
      {children}
    </div>
  );
}
