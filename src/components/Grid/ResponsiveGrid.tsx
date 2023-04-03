import React, { FunctionComponent } from 'react';

type Props = {
  children: React.ReactNode;
};

const ResponsiveGrid: FunctionComponent<Props> = ({ children }) => (
  <div className='-z-50 grid max-w-4xl gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
    {children}
  </div>
);

export default ResponsiveGrid;
