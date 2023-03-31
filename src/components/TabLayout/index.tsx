import React, { FunctionComponent } from 'react';

interface Props {
  children?: React.ReactNode;
  className?: string;
  classNameChild?: string;
  paddingTop?: boolean;
}

const TabLayout: FunctionComponent<Props> = ({
  children,
  className,
  classNameChild,
  paddingTop = true,
}) => (
  <div
    className={`flex h-full w-full flex-col items-center justify-center ${className}`}
  >
    <div className={`${paddingTop ? 'pt-16' : ''} ${classNameChild}`}>
      {children}
    </div>
  </div>
);

export default TabLayout;
