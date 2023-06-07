import React, { ReactNode } from 'react';

const ResponsiveGrid: React.FC<{ children: ReactNode }> = ({ children }) => (
  <div className='grid grid-cols-1 gap-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
    {children}
  </div>
);

export default ResponsiveGrid;
