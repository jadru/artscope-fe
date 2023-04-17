import React, { FunctionComponent } from 'react';

interface Props {
  children?: React.ReactNode;
  className?: string;
  classNameChild?: string;
  paddingTop?: boolean;
  dark?: boolean;
}

const TabLayout: FunctionComponent<Props> = ({
  children,
  className,
  classNameChild,
  paddingTop = true,
  dark = false,
}) => (
  <div
    className={`flex h-full w-full flex-col items-center justify-center ${
      dark ? 'bg-black' : 'bg-white'
    } ${className} `}
  >
    <div
      className={`${
        paddingTop ? 'pt-16' : ''
      } w-screen max-w-4xl px-2 md:px-4 ${classNameChild}`}
    >
      {children}
    </div>
  </div>
);

export default TabLayout;
