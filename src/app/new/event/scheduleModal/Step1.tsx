import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Checkbox, Input } from '@nextui-org/react';
import { add, addHours } from 'date-fns';
import { ko } from 'date-fns/locale';
import React from 'react';

import { initialScheduleSchema } from '@/app/new/event/initialEventSchema';
import AddLocation from '@/app/new/event/location/AddLocation';
import { useScheduleSetupStepperStore } from '@/states/scheduleSetupStepperState';

import { CreateScheduleTempType } from '@/types/event';

export default function Step1({
  schedule,
  setSchedule,
}: {
  setSchedule: React.Dispatch<React.SetStateAction<CreateScheduleTempType[]>>;
  schedule: CreateScheduleTempType[];
}) {
  const { step1, setStep1 } = useScheduleSetupStepperStore();

  return (
    <div className='flex flex-col gap-2'>
      <Checkbox
        isSelected={step1.isDayRotate}
        onValueChange={(value) => {
          setStep1({
            ...step1,
            isDayRotate: value,
            isDone: !value,
          });
        }}
      >
        이벤트가 이틀 이상 반복됩니다.
      </Checkbox>
      <Checkbox
        isSelected={!step1.isDayRotate && step1.isDayRotate !== undefined}
        onValueChange={(value) => {
          setStep1({
            ...step1,
            isDayRotate: !value,
            isDone: value ? undefined : true,
          });
        }}
      >
        이벤트가 하루만에 끝납니다.
      </Checkbox>
      {step1.isDayRotate === true && (
        <>
          <hr />
          <p>다음 페이지로 넘어가주세요</p>
        </>
      )}
      {step1.isDayRotate === false && (
        <>
          <hr />
          <Checkbox
            isSelected={!step1.isSeparate && step1.isSeparate !== undefined}
            onValueChange={(value) => {
              setStep1({
                ...step1,
                isSeparate: !value,
                isDone: true,
              });
              if (value) {
                setSchedule([initialScheduleSchema]);
              }
            }}
          >
            일정이 하나면 충분합니다.
          </Checkbox>
          <Checkbox
            isSelected={step1.isSeparate}
            onValueChange={(value) => {
              setStep1({
                ...step1,
                isSeparate: value,
                isDone: true,
              });
              if (!value) {
                setSchedule([initialScheduleSchema]);
              }
            }}
          >
            2개 이상 세션이 있습니다.
          </Checkbox>
        </>
      )}
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
        {step1.isDayRotate === false && step1.isSeparate !== undefined && (
          <>
            <hr />
            <div className='flex items-center justify-between px-3'>
              <h3 className='text-lg font-bold'>일정</h3>
              {step1.isSeparate && (
                <button
                  onClick={() => {
                    setSchedule((prev) => [
                      ...prev,
                      prev.length === 0
                        ? initialScheduleSchema
                        : {
                            ...prev[prev.length - 1],
                            id: prev[prev.length - 1].id + 1,
                            locationId: prev[prev.length - 1].locationId,
                            locationName: prev[prev.length - 1].locationName,
                            startDateTime: prev[prev.length - 1].endDateTime,
                            endDateTime: addHours(
                              prev[prev.length - 1].endDateTime,
                              2
                            ),
                          },
                    ]);
                  }}
                  className='flex items-center justify-center gap-2 text-sm text-default-500 hover:text-default-900'
                >
                  + 일정 추가
                </button>
              )}
            </div>
            <div className='flex flex-col items-stretch gap-2 px-3 py-2'>
              {schedule.map((item, index) => (
                <div
                  key={item.id}
                  className='flex flex-col gap-3 rounded-xl border p-2'
                >
                  <div className='flex justify-between'>
                    <div className='flex items-center justify-start gap-1'>
                      <AddLocation
                        setLocation={(location) =>
                          setSchedule((prev) => {
                            const temp = [...prev];
                            temp[index].locationId = location.locationId;
                            temp[index].locationName = location.locationName;
                            return [...temp];
                          })
                        }
                        location={{
                          locationId: item.locationId,
                          locationName: item.locationName,
                        }}
                      />
                      <Input
                        className='h-12'
                        label='상세 이벤트 장소'
                        value={item.detailLocation}
                        placeholder='예) 1층 101호'
                        onValueChange={(value) =>
                          setSchedule((prev) => {
                            const temp = [...prev];
                            temp[index].detailLocation = value;
                            return [...temp];
                          })
                        }
                        variant='bordered'
                      />
                    </div>
                    {step1.isSeparate && (
                      <button
                        onClick={() =>
                          setSchedule((prev) =>
                            prev.length === 1
                              ? [initialScheduleSchema]
                              : prev.filter(
                                  (deleteItem) => deleteItem.id !== item.id
                                )
                          )
                        }
                      >
                        삭제
                      </button>
                    )}
                  </div>
                  <div className='flex flex-col gap-2 md:flex-row'>
                    <TimePicker
                      label='시작 날짜 및 시간'
                      value={item.startDateTime}
                      onChange={(newValue) =>
                        newValue &&
                        setSchedule((prev) => {
                          const temp = [...prev];
                          temp[index].startDateTime = newValue;
                          temp[index].endDateTime = add(newValue, { hours: 2 });
                          return [...temp];
                        })
                      }
                    />
                    <TimePicker
                      label='종료 시간'
                      value={item.endDateTime}
                      onChange={(newValue) => {
                        newValue &&
                          setSchedule((prev) => {
                            const temp = [...prev];
                            if (newValue < temp[index].startDateTime)
                              if (confirm('혹시 이벤트가 자정을 넘기나요?'))
                                temp[index].endDateTime = add(newValue, {
                                  days: 1,
                                });
                              else
                                temp[index].endDateTime = add(
                                  temp[index].startDateTime,
                                  {
                                    hours: 2,
                                  }
                                );
                            else {
                              temp[0].endDateTime = newValue;
                            }
                            return [...temp];
                          });
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </LocalizationProvider>
    </div>
  );
}
