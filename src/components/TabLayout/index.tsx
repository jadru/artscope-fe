import React from 'react';

import BottomBar from '@/components/TabLayout/BottomBar';

import { NavBar } from './NavBar';

interface Props {
  children?: React.ReactNode;
  className?: string;
  classNameChild?: string;
}

const TabLayout: React.FC<Props> = ({
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
    <div className={`pt-16 pb-20 md:pb-28 ${classNameChild}`}>{children}</div>
    <BottomBar />
  </div>
);

export default TabLayout;
