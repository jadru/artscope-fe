import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import React from 'react';
import { BiCalendar, BiParty, BiRotateRight, BiTime } from 'react-icons/bi';

import Stepper from '@/components/Stepper';

import { initialScheduleSchema } from '@/app/new/event/initialEventSchema';
import Step1 from '@/app/new/event/scheduleModal/Step1';
import Step2 from '@/app/new/event/scheduleModal/Step2';
import { useScheduleSetupStepperStore } from '@/states/scheduleSetupStepperState';

import { CreateScheduleTempType } from '@/types/event';

type ScheduleModalProps = {
  setSchedule: React.Dispatch<React.SetStateAction<CreateScheduleTempType[]>>;
  schedule: CreateScheduleTempType[];
};

export default function ScheduleModal(Props: ScheduleModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { step1, step2, step3, step4, resetSteps } =
    useScheduleSetupStepperStore();
  const [_finishStep, setFinishStep] = React.useState<number>();

  const steps = [
    {
      title: '반복 선택',
      description: '이벤트가 반복인지 알려주세요.',
      icon: <BiRotateRight />,
    },
    {
      title: '날짜 선택',
      description: '이벤트 운영 날짜를 선택해주세요.',
      icon: <BiCalendar />,
    },
    {
      title: '시간 선택',
      description: '이벤트 운영 시간을 선택해주세요.',
      icon: <BiTime />,
    },
    {
      title: '스페셜 스케줄',
      description: '특별한 스케줄이 있는지 알려주세요.',
      icon: <BiParty />,
    },
  ];

  return (
    <>
      <Button onPress={onOpen}>Open Modal</Button>
      <Modal
        onClose={() => {
          Props.setSchedule([initialScheduleSchema]);
          resetSteps();
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        size='3xl'
        scrollBehavior='inside'
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                스케줄 입력
              </ModalHeader>
              <ModalBody>
                <Stepper
                  titlesWithIcon={steps}
                  isDone={[
                    step1.isDone,
                    step2.isDone,
                    step3.isDone,
                    step4.isDone,
                  ]}
                  onFinish={(step) => {
                    setFinishStep(step);
                    onClose();
                  }}
                >
                  <Step1
                    schedule={Props.schedule}
                    setSchedule={Props.setSchedule}
                  />
                  <Step2
                    schedule={Props.schedule}
                    setSchedule={Props.setSchedule}
                  />
                </Stepper>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
