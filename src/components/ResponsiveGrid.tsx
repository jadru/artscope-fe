import React from 'react';

export default function ResponsiveGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={
        'grid w-full grid-cols-1 gap-2.5 px-4 py-3 md:grid-cols-2 md:gap-2.5 md:px-2 md:py-1.5 lg:grid-cols-3 ' +
        className
      }
    >
      {children}
    </div>
  );
}
