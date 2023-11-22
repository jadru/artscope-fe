import { Checkbox } from '@nextui-org/react';
import React from 'react';

import DateMultiplePicker from '@/components/DateMultiplePicker';

import { initialScheduleSchema } from '@/app/new/event/initialEventSchema';
import { useScheduleSetupStepperStore } from '@/states/scheduleSetupStepperState';

import { CreateScheduleTempType } from '@/types/event';

export default function Step2({
  _schedule,
  setSchedule,
}: {
  setSchedule: React.Dispatch<React.SetStateAction<CreateScheduleTempType[]>>;
  schedule: CreateScheduleTempType[];
}) {
  // TODO: DateMultiplePicker에 state를 따로 빼야됨
  const [scheduleDate, setScheduleDate] = React.useState<Date[]>([]);
  const { step2, setStep2 } = useScheduleSetupStepperStore();
  return (
    <div>
      <DateMultiplePicker
        multiple={false}
        onDateChangeMultiple={(date) => setScheduleDate(date)}
      />
      {scheduleDate.length === 2 && (
        <Checkbox
          onValueChange={(value) => {
            setStep2({
              ...step2,
              isDone: value,
            });
            if (value) {
              setSchedule([initialScheduleSchema]);
            }
          }}
        >
          휴일을 일정에서 제외하겠습니다.
        </Checkbox>
      )}
    </div>
  );
}
