import React, { FunctionComponent } from 'react';

interface Props {
  children?: React.ReactNode;
  className?: string;
  classNameChild?: string;
  paddingTop?: boolean;
  dark?: boolean;
  fullWidth?: boolean;
  main?: boolean;
  top?: boolean;
}

const TabLayout: FunctionComponent<Props> = ({
  children,
  className,
  classNameChild,
  paddingTop = true,
  dark = false,
  fullWidth = false,
  main = false,
  top = false,
}) => (
  <div
    className={`flex h-full min-h-[85vh] w-screen flex-col ${
      top ? 'justify-start' : 'justify-center'
    } items-center ${dark ? '' : 'bg-white dark:bg-dark'} ${
      className ? className : '' + ''
    } `}
  >
    <div
      className={`${paddingTop ? 'pt-16' : ''} w-screen ${
        !main && 'px-2 md:px-3'
      } ${fullWidth ? '' : 'max-w-4xl'} ${classNameChild}`}
    >
      {children}
    </div>
  </div>
);

export default TabLayout;
