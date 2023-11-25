import { Checkbox } from '@nextui-org/react';
import { format } from 'date-fns';
import React, { useEffect } from 'react';

import DateMultiplePicker from '@/components/DateMultiplePicker';

import { useScheduleSetupStepperStore } from '@/states/scheduleSetupStepperState';

export default function Step2() {
  const { step2, setStep2 } = useScheduleSetupStepperStore();
  const [scheduleDate, setScheduleDate] = React.useState<Date[]>([]);
  const [holiday, setHoliday] = React.useState<boolean>(false);

  useEffect(() => {
    if (scheduleDate.length === 2)
      setStep2({
        ...step2,
        startDate: scheduleDate[0],
        endDate: scheduleDate[1],
        isDone: false,
      });
    else {
      setStep2({
        ...step2,
        isDone: undefined,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scheduleDate, setStep2]);
  return (
    <div className='space-y-1'>
      {!holiday && (
        <>
          <p>이벤트 기간을 선택해주세요.</p>
          <DateMultiplePicker
            multiple={false}
            scheduleDate={scheduleDate}
            onDateChangeRange={(date) => setScheduleDate(date)}
          />
          {scheduleDate.length === 2 && (
            <Checkbox
              onValueChange={(value) => {
                setHoliday(value);
              }}
            >
              휴일이 있습니다.
            </Checkbox>
          )}
        </>
      )}
      {holiday && scheduleDate[0] && scheduleDate[1] && (
        <>
          <p>휴일만 선택해주세요.</p>
          <DateMultiplePicker
            multiple={true}
            startDate={scheduleDate[0]}
            endDate={scheduleDate[1]}
            onDateChangeMultiple={(date) =>
              setStep2({ ...step2, holidays: date })
            }
          />
          <p>휴일</p>
          <div className='flex flex-wrap items-center gap-1'>
            {step2.holidays.map((date) => (
              <div key={date.toString()} className='bg-default-50 p-1'>
                {format(date, 'MM월 dd일')}
              </div>
            ))}
          </div>
        </>
      )}
      <p className='font-bold'>
        기간 {' : '}
        {scheduleDate[0] && format(scheduleDate[0], 'yyyy년 MM월 dd일')}
        {scheduleDate[1] && ' - ' + format(scheduleDate[1], 'yyyy년 MM월 dd일')}
      </p>
    </div>
  );
}
