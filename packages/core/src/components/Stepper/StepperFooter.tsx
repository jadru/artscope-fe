import React from 'react';

import { Button } from '@/components/ui/button';

type StepperFooterProps = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  totalStepSize: number;
  activeStep: number;
  // eslint-disable-next-line no-unused-vars
  onFinish?: (step: number) => void;
  isDone: (boolean | undefined)[];
};

const StepperFooter = ({
  setActiveStep,
  totalStepSize,
  activeStep,
  onFinish,
  isDone,
}: StepperFooterProps) => (
  <div className='flex h-20 w-full items-center justify-between'>
    {activeStep > 0 ? (
      <Button onClick={() => setActiveStep((prev) => prev - 1)}>
        뒤로가기
      </Button>
    ) : (
      <div className='h-1 w-1'></div>
    )}
    {totalStepSize !== activeStep + 1 && isDone && !isDone[activeStep] ? (
      <Button
        color='primary'
        onClick={() => setActiveStep((prev) => prev + 1)}
        disabled={isDone[activeStep] === undefined}>
        다음
      </Button>
    ) : (
      <Button
        color='primary'
        onClick={() => (onFinish ? onFinish(activeStep) : undefined)}
        disabled={isDone[activeStep] === undefined}>
        완료
      </Button>
    )}
  </div>
);

export default StepperFooter;
