'use client';

import React from 'react';

import StepperBody from '@/components/Stepper/StepperBody';
import StepperFooter from '@/components/Stepper/StepperFooter';
import StepperHeader from '@/components/Stepper/StepperHeader';

export type titleWithIcon = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

type StepperProps = {
  titlesWithIcon: titleWithIcon[];
  children: React.ReactNode[];
  // eslint-disable-next-line no-unused-vars
  onFinish?: (step: number) => void;
  isDone: (boolean | undefined)[];
};

export default function Stepper({
  children,
  titlesWithIcon,
  onFinish,
  isDone,
}: StepperProps) {
  const [activeStep, setActiveStep] = React.useState(0);
  const size = children.length;

  return (
    <div className='h-full w-full'>
      <StepperHeader
        titlesWithIcon={titlesWithIcon}
        setActiveStep={setActiveStep}
        activeStep={activeStep}
      />
      <StepperBody>{children[activeStep]}</StepperBody>
      <StepperFooter
        setActiveStep={setActiveStep}
        activeStep={activeStep}
        totalStepSize={size}
        onFinish={onFinish}
        isDone={isDone}
      />
    </div>
  );
}
