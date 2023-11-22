import { Button } from '@nextui-org/react';
import React from 'react';

import { titleWithIcon } from '@/components/Stepper/index';

type StepperHeaderProps = {
  titlesWithIcon: titleWithIcon[];
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  activeStep: number;
};
const StepperHeader = ({
  titlesWithIcon,
  setActiveStep,
  activeStep,
}: StepperHeaderProps) => (
  <div className='flex h-14 w-full items-center justify-center'>
    <div className='flex items-center justify-center gap-1 rounded-xl border bg-default-50 p-1.5'>
      {titlesWithIcon.map((titleWithIcon, index) => (
        <Button
          key={titleWithIcon.title}
          size='md'
          disabled={index !== activeStep}
          color={index === activeStep ? 'primary' : 'default'}
          onClick={() => setActiveStep(index)}
          startContent={titleWithIcon.icon}
        >
          {titleWithIcon.title}
        </Button>
      ))}
    </div>
  </div>
);

export default StepperHeader;
