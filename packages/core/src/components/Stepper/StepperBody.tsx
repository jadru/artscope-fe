import React from 'react';

type StepperBodyProps = {
  children: React.ReactNode;
};

const StepperBody = ({ children }: StepperBodyProps) => (
  <div className='min-h-[300px] p-1 md:p-3'>{children}</div>
);

export default StepperBody;
