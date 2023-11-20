'use client';

import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
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
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useRouter } from 'next/navigation';
import React from 'react';

import { initialScheduleSchema } from '@/app/new/event/initialEventSchema';
import AddLocation from '@/app/new/event/location/AddLocation';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { CreateScheduleType } from '@/types/event';

type SchduleAddButtonProps = {
  eventid: number;
  eventAuthorUsername: string;
} & React.ComponentProps<'button'>;

export default function ScheduleAddButton(Props: SchduleAddButtonProps) {
  const { refresh } = useRouter();
  const { user } = useUser();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [schedule, setSchedule] = React.useState<CreateScheduleType[]>([
    initialScheduleSchema,
  ]);

  const handleAddSchedule = async () =>
    jxios.post(`/api/exhibitions/${Props.eventid}/schedule`, {
      eventDate: format(schedule[0].eventDate, 'yyyy-MM-dd'),
      startTime: format(schedule[0].startTime, 'HH:mm'),
      endTime: format(schedule[0].endTime, 'HH:mm'),
      locationId: schedule[0].locationId,
      detailLocation: schedule[0].detailLocation,
      participants: schedule[0].participants,
    });

  return user?.name === Props.eventAuthorUsername ? (
    <>
      <button onClick={onOpen} {...Props} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement='top-center'>
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
                    <DatePicker
                      label='시작 날짜'
                      value={schedule[0].eventDate}
                      onChange={(newValue) =>
                        newValue &&
                        setSchedule((prev) => {
                          const temp = [...prev];
                          temp[0].eventDate = newValue;
                          return [...temp];
                        })
                      }
                    />
                    <TimePicker
                      label='시작 시간'
                      value={schedule[0].startTime}
                      onChange={(newValue) => {
                        newValue &&
                          setSchedule((prev) => {
                            const temp = [...prev];
                            temp[0].startTime = newValue;
                            return [...temp];
                          });
                      }}
                    />
                    <TimePicker
                      label='종료 시간'
                      value={schedule[0].endTime}
                      onChange={(newValue) => {
                        newValue &&
                          setSchedule((prev) => {
                            const temp = [...prev];
                            temp[0].endTime = newValue;
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
