import { Input } from '@nextui-org/react';
import React from 'react';

import AddLocation from '@/app/new/event/location/AddLocation';
import { useScheduleSetupStepperStore } from '@/states/scheduleSetupStepperState';

export default function Step4() {
  const { step4, setStep4 } = useScheduleSetupStepperStore();

  return (
    <div className='space-y-2'>
      <p>장소 선택</p>
      <AddLocation
        location={{
          locationId: step4.usualLocationId,
          locationName: step4.usualLocationName,
        }}
        setLocation={(location) => {
          setStep4({
            ...step4,
            usualLocationId: location.locationId,
            usualLocationName: location.locationName,
            isDone: true,
          });
        }}
      />
      <Input
        className='h-12'
        label='상세 이벤트 장소'
        value={step4.usualDetailLocation}
        placeholder='예) 1층 A홀'
        onValueChange={(value) =>
          setStep4({
            ...step4,
            usualDetailLocation: value,
          })
        }
        variant='bordered'
      />
    </div>
  );
}
