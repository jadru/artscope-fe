import React from 'react';

export default function ResponsiveGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className='grid grid-cols-4'>{children}</div>;
}
