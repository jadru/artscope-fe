import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Checkbox } from '@nextui-org/react';
import { ko } from 'date-fns/locale';
import React, { useEffect } from 'react';

import { useScheduleSetupStepperStore } from '@/states/scheduleSetupStepperState';

export default function Step3() {
  const { step3, setStep3 } = useScheduleSetupStepperStore();

  useEffect(() => {
    setStep3({
      ...step3,
      isDone: false,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className='flex flex-col gap-2'>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ko}>
        <div className='flex flex-col gap-2 rounded-2xl border-2 p-3  '>
          <p>주로 운영하는 시간을 알려주세요.</p>
          <div className='flex w-full justify-between gap-1'>
            <TimePicker
              className='w-1/2'
              label='시작 시간'
              value={step3.usualStartTime}
              onChange={(date) =>
                setStep3({
                  ...step3,
                  usualStartTime: date as Date,
                })
              }
            />
            <TimePicker
              className='w-1/2'
              label='종료 시간'
              value={step3.usualEndTime}
              onChange={(date) =>
                setStep3({
                  ...step3,
                  usualEndTime: date as Date,
                })
              }
            />
          </div>
        </div>
        <Checkbox
          onValueChange={(value) => {
            setStep3({
              ...step3,
              hasSpecialTime: value,
            });
          }}>
          요일별로 운영시간이 다릅니다.
        </Checkbox>
        {step3.hasSpecialTime && (
          <div className='flex flex-col gap-2 rounded-2xl border-2 p-3  '>
            <p>운영시간이 다른 요일과 시간을 선택해주세요.</p>
            <div className='flex justify-evenly'>
              {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                <Checkbox
                  key={index}
                  onValueChange={(value) => {
                    if (value) {
                      setStep3({
                        ...step3,
                        someEventsTimes: [
                          ...step3.someEventsTimes,
                          {
                            dayOfWeek: index,
                            startTime: new Date('2023-12-31T10:00:00.000Z'),
                            endTime: new Date('2023-12-31T17:00:00.000Z'),
                          },
                        ],
                      });
                    } else {
                      setStep3({
                        ...step3,
                        someEventsTimes: step3.someEventsTimes.filter(
                          (time) => time.dayOfWeek !== index
                        ),
                      });
                    }
                  }}>
                  {day}
                </Checkbox>
              ))}
            </div>
          </div>
        )}
        {step3.hasSpecialTime &&
          step3.someEventsTimes.length > 0 &&
          step3.someEventsTimes
            .sort((a, b) => (a.dayOfWeek > b.dayOfWeek ? 1 : -1))
            .map((time, index) => (
              <div
                className='flex flex-col gap-2 rounded-2xl border-2 p-3'
                key={time.dayOfWeek}>
                <p>
                  {['일', '월', '화', '수', '목', '금', '토'][time.dayOfWeek]}
                  요일 오픈하는 시간을 알려주세요.
                </p>
                <div className='flex w-full justify-between gap-1'>
                  <TimePicker
                    className='w-1/2'
                    label='시작 시간'
                    value={step3.usualStartTime}
                    onChange={(date) =>
                      setStep3({
                        ...step3,
                        someEventsTimes: [
                          ...step3.someEventsTimes.slice(0, index),
                          {
                            ...step3.someEventsTimes[index],
                            startTime: date as Date,
                          },
                          ...step3.someEventsTimes.slice(index + 1),
                        ],
                      })
                    }
                  />
                  <TimePicker
                    className='w-1/2'
                    label='종료 시간'
                    value={step3.usualEndTime}
                    onChange={(date) =>
                      setStep3({
                        ...step3,
                        someEventsTimes: [
                          ...step3.someEventsTimes.slice(0, index),
                          {
                            ...step3.someEventsTimes[index],
                            endTime: date as Date,
                          },
                          ...step3.someEventsTimes.slice(index + 1),
                        ],
                      })
                    }
                  />
                </div>
              </div>
            ))}
      </LocalizationProvider>
    </div>
  );
}
