import React from 'react';

export default function RootLayout({
  children,
  maxWidth = 'max-w-screen-md',
  className = '',
}: {
  children: React.ReactNode;
  maxWidth?:
    | 'max-w-screen-sm'
    | 'max-w-screen-md'
    | 'max-w-screen-lg'
    | 'max-w-screen-xl';
  className?: string;
}) {
  return (
    <div
      className={`container mx-auto flex flex-col items-center justify-center ${className}`}
    >
      <div className={`container ${maxWidth}`}>{children}</div>
    </div>
  );
}
