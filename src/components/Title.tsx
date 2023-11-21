import * as React from 'react';

type Props = {
  title: string;
  description?: string | React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  divider?: boolean;
};

const Title = ({
  title,
  description,
  className,
  divider = false,
  children,
}: Props) => (
  <div
    className={`flex flex-col justify-between ${
      divider ? 'border-b' : ''
    } md:flex-row ${className} px-3 py-3`}
  >
    <div>
      <h1 className='text-3xl font-bold'>{title}</h1>
      {description && (
        <h3 className='text-[0.95rem] text-default-700'>{description}</h3>
      )}
    </div>
    {children}
  </div>
);

export default Title;
