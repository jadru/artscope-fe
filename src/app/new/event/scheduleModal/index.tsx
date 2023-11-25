import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { eachDayOfInterval, format } from 'date-fns';
import React from 'react';
import { BiBuilding, BiCalendar, BiRotateRight, BiTime } from 'react-icons/bi';
import { toast } from 'react-toastify';

import Stepper from '@/components/Stepper';

import Step1 from '@/app/new/event/scheduleModal/Step1';
import Step2 from '@/app/new/event/scheduleModal/Step2';
import Step3 from '@/app/new/event/scheduleModal/Step3';
import Step4 from '@/app/new/event/scheduleModal/Step4';
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
      title: '장소 선택',
      description: '이벤트 운영 장소를 선택해주세요.',
      icon: <BiBuilding />,
    },
    // {
    //   title: '스페셜 스케줄',
    //   description: '특별한 스케줄이 있는지 알려주세요.',
    //   icon: <BiParty />,
    // },
  ];

  const handleStep3 = () => {
    if (
      !step1.isDayRotate ||
      !step2.startDate ||
      !step2.endDate ||
      !step3.usualStartTime ||
      !step3.usualEndTime
    ) {
      toast.warn('모든 필드를 완료해주세요.');
      return;
    }

    const temp: CreateScheduleTempType[] = [];
    let count = 0;

    eachDayOfInterval({
      start: step2.startDate,
      end: step2.endDate,
    }).forEach((date) => {
      if (
        !step2.holidays.find(
          (holiday) =>
            format(date, 'yyyy-MM-dd') === format(holiday, 'yyyy-MM-dd')
        )
      ) {
        const specialTimeOfWeek = step3.someEventsTimes.find(
          (specialTimeOfWeek) =>
            Number(format(date, 'e')) === specialTimeOfWeek.dayOfWeek + 1
        );

        const startTime = specialTimeOfWeek
          ? specialTimeOfWeek.startTime
          : step3.usualStartTime;

        const endTime = specialTimeOfWeek
          ? specialTimeOfWeek.endTime
          : step3.usualEndTime;

        temp.push({
          id: count,
          locationId: step4.usualLocationId,
          locationName: step4.usualLocationName ?? '',
          detailLocation: step4.usualDetailLocation ?? '',
          startDateTime: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            startTime.getHours(),
            startTime.getMinutes()
          ),
          endDateTime: new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            endTime.getHours(),
            endTime.getMinutes()
          ),
          participants: [],
        });
        count++;
      }
    });
    Props.setSchedule(temp);
  };

  return (
    <>
      <Button
        onPress={onOpen}
        color='primary'
        startContent={<BiCalendar />}
        variant='light'
      >
        스케줄 {Props.schedule.length > 0 ? '수정' : '생성'}
      </Button>
      <Modal
        onClose={resetSteps}
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
                스케줄 생성
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
                    if (step === 3) {
                      handleStep3();
                    }
                    onClose();
                  }}
                >
                  <Step1
                    schedule={Props.schedule}
                    setSchedule={Props.setSchedule}
                  />
                  <Step2 />
                  <Step3 />
                  <Step4 />
                </Stepper>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
