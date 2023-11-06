import * as React from 'react';

type Props = {
  title: string;
  description?: string | React.ReactNode;
  className?: string;
};

const Title = ({ title, description, className }: Props) => (
  <div className={`border-b ${className} px-3 py-3`}>
    <h1 className='text-3xl font-bold'>{title}</h1>
    {description && (
      <h3 className='text-[0.95rem] text-default-700'>{description}</h3>
    )}
  </div>
);

export default Title;
