import { Button } from '@nextui-org/react';
import React from 'react';
import { BiArrowToLeft, BiArrowToRight, BiCheck } from 'react-icons/bi';

type StepperFooterProps = {
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  totalStepSize: number;
  activeStep: number;
  onFinish?: (step: number) => void;
  isDone?: (boolean | undefined)[];
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
      <Button
        startContent={<BiArrowToLeft />}
        onClick={() => setActiveStep((prev) => prev - 1)}
      >
        뒤로가기
      </Button>
    ) : (
      <div className='h-1 w-1'></div>
    )}
    {totalStepSize !== activeStep + 1 && isDone && !isDone[activeStep] ? (
      <Button
        color='primary'
        startContent={<BiArrowToRight />}
        onClick={() => setActiveStep((prev) => prev + 1)}
        disabled={isDone[activeStep] === undefined}
      >
        다음
      </Button>
    ) : (
      <Button
        color='primary'
        startContent={<BiCheck />}
        onClick={() => (onFinish ? onFinish(activeStep) : undefined)}
        disabled={isDone && isDone[activeStep] === undefined}
      >
        완료
      </Button>
    )}
  </div>
);

export default StepperFooter;
