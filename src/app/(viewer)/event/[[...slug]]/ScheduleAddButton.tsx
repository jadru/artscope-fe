'use client';

import {
  DateTimePicker,
  LocalizationProvider,
  TimePicker,
} from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { add, format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import React from 'react';

import { initialScheduleSchema } from '@/app/new/event/initialEventSchema';
import AddLocation from '@/app/new/event/location/AddLocation';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { CreateScheduleTempType } from '@/types/event';

type SchduleAddButtonProps = {
  eventid: number;
  eventAuthorUsername: string;
} & React.ComponentProps<'button'>;

export default function ScheduleAddButton(Props: SchduleAddButtonProps) {
  const { refresh } = useRouter();
  const { user, isAdmin } = useUser();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [schedule, setSchedule] = React.useState<CreateScheduleTempType[]>([
    initialScheduleSchema,
  ]);

  const handleAddSchedule = async () =>
    jxios.post(`/api/exhibitions/${Props.eventid}/schedule`, {
      startDateTime: format(schedule[0].startDateTime, "yyyy-MM-dd'T'HH:mm"),
      endDateTime: format(schedule[0].endDateTime, "yyyy-MM-dd'T'HH:mm"),
      locationId: schedule[0].locationId,
      detailLocation: schedule[0].detailLocation,
      participants: schedule[0].participants,
    });

  return (user && user?.username === Props.eventAuthorUsername) || isAdmin ? (
    <>
      <button onClick={onOpen} {...Props} />
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement='top-center'
        hideCloseButton
        isDismissable={false}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className='flex flex-col gap-1'>
                스케줄 추가
              </ModalHeader>
              <ModalBody>
                <AddLocation
                  setSchedule={setSchedule}
                  scheduleIndex={0}
                  schedule={schedule}
                />
                <Input
                  label='상세 이벤트 장소'
                  value={schedule[0].detailLocation}
                  placeholder='예) 1층 101호'
                  onValueChange={(value) =>
                    setSchedule((prev) => {
                      const temp = [...prev];
                      temp[0].detailLocation = value;
                      return [...temp];
                    })
                  }
                  variant='bordered'
                />
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={ko}
                >
                  <div className='flex flex-col gap-2'>
                    <DateTimePicker
                      label='시작 시간'
                      value={schedule[0].startDateTime}
                      onChange={(newValue) =>
                        newValue &&
                        setSchedule((prev) => {
                          const temp = [...prev];
                          temp[0].startDateTime = newValue;
                          temp[0].endDateTime = add(newValue, { hours: 2 });
                          return [...temp];
                        })
                      }
                    />
                    <TimePicker
                      label='종료 시간'
                      value={schedule[0].endDateTime}
                      onChange={(newValue) => {
                        newValue &&
                          setSchedule((prev) => {
                            const temp = [...prev];
                            if (newValue < temp[0].startDateTime)
                              if (confirm('혹시 이벤트가 자정을 넘기나요?')) {
                                temp[0].endDateTime = add(newValue, {
                                  days: 1,
                                });
                              } else {
                                temp[0].endDateTime = add(
                                  temp[0].startDateTime,
                                  { hours: 2 }
                                );
                              }
                            return [...temp];
                          });
                      }}
                    />
                  </div>
                </LocalizationProvider>
              </ModalBody>
              <ModalFooter>
                <Button
                  color='danger'
                  variant='flat'
                  onPress={() => {
                    setSchedule([initialScheduleSchema]);
                    onClose();
                  }}
                >
                  취소
                </Button>
                <Button
                  color='primary'
                  onPress={() => {
                    handleAddSchedule();
                    onClose();
                    refresh();
                  }}
                >
                  추가
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  ) : (
    <></>
  );
}
