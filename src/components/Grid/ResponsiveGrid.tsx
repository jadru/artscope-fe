import React from 'react';

interface Props {
  children?: React.ReactNode;
}

const ResponsiveGrid: React.FC<Props> = ({ children }) => (
  <div className='-z-50 grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
    {children}
  </div>
);

export default ResponsiveGrid;
