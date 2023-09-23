import React from 'react';

export default function ResponsiveGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='grid grid-cols-3 gap-2.5 py-4'>{children}</div>;
}
