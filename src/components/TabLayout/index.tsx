import React, { FunctionComponent } from 'react';

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
  <div
    className={`flex h-full w-full flex-col items-center justify-center ${className}`}
  >
    <div className={`pt-16 ${classNameChild}`}>{children}</div>
  </div>
);

export default TabLayout;
