import React from 'react';

import { titleWithIcon } from '@/components/Stepper/index';

type StepperHeaderProps = {
  titlesWithIcon: titleWithIcon[];
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  activeStep: number;
};
const StepperHeader = ({ titlesWithIcon, activeStep }: StepperHeaderProps) => (
  <div className='flex h-14 w-full items-center justify-center'>
    <div className='flex items-center justify-center gap-0.5 rounded-xl border p-1.5'>
      {titlesWithIcon.map((titleWithIcon, index) => (
        <div
          key={titleWithIcon.title}
          className={`md:text-medium flex items-center justify-center gap-0.5 rounded-xl border p-1.5 text-sm ${
            activeStep === index ? 'bg-default-200' : 'bg-default-50'
          }`}
        >
          {activeStep === index && titleWithIcon.icon} {titleWithIcon.title}
        </div>
      ))}
    </div>
  </div>
);

export default StepperHeader;
