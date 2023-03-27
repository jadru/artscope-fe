import React, { FunctionComponent } from 'react';

import { NavBar } from './NavBar';

interface Props {
  children?: React.ReactNode;
  className?: string;
  classNameChild?: string;
}

const TabLayout: FunctionComponent<Props> = ({
  children,
  className,
  classNameChild,
}) => (
  <div className={`flex h-full w-full flex-col ${className}`}>
    <NavBar
      title='ArtPlatform'
      onSearchClick={() => {
        // eslint-disable-next-line no-console
        console.log('Search Button Clicked');
      }}
    />
    <div className={`pt-16 ${classNameChild}`}>{children}</div>
  </div>
);

export default TabLayout;
