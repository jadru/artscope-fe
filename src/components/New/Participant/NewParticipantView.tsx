import { Chip, Kbd } from '@nextui-org/react';
import React from 'react';

import { CreateScheduleType } from '@/types/event';

type Props = {
  schedule: CreateScheduleType[];
  setSchedule: React.Dispatch<React.SetStateAction<CreateScheduleType[]>>;
  index: number;
};

const _maxTagCount = 20;

export default function NewParticipantView({
  schedule,
  setSchedule,
  index,
}: Props) {
  const _handleAddUsername = (username: string) => {
    if (username === '') return;
    schedule[index].participants.length === 0
      ? setSchedule((prev) => {
          const newSchedule = [...prev];
          newSchedule[index].participants = [{ username }];
          return newSchedule;
        })
      : schedule[index].participants.filter(
          (item) => item.username !== username
        ).length === schedule[index].participants.length
      ? setSchedule((prev) => {
          const newSchedule = [...prev];
          newSchedule[index].participants = [
            ...newSchedule[index].participants,
            { username },
          ];
          return newSchedule;
        })
      : '';
  };

  const handleAddJustName = (name: string) => {
    if (name === '') return;
    schedule[index].participants.filter((item) => item.name === name).length ===
      0 &&
      setSchedule((prev) => {
        const newSchedule = [...prev];
        newSchedule[index].participants = [
          ...newSchedule[index].participants,
          { name },
        ];
        return newSchedule;
      });
  };

  const regTagExp = /[`~!#$%^&*()_|+=?;:'",.<>{}[\]\\/ ]/gim;

  return (
    <div className='flex flex-wrap'>
      {schedule[index].participants &&
        schedule[index].participants.map((item) => (
          <Chip
            onClose={() => {
              setSchedule((prev) => {
                const newSchedule = [...prev];
                newSchedule[index].participants = newSchedule[
                  index
                ].participants.filter((participant) => participant !== item);
                return newSchedule;
              });
            }}
            className='m-1 h-8 animate-appearance-in rounded-xl bg-blue-50'
            size='lg'
            key={item.name ?? item.username}
          >
            {item.name ?? item.username}
          </Chip>
        ))}

      <div className='relative m-1 h-8 w-40 rounded-xl bg-blue-50'>
        <Kbd
          keys={['enter']}
          className='absolute bottom-auto right-2 top-1/2 -translate-y-1/2'
        ></Kbd>
        <input
          className='m-1 h-6 max-h-6 w-32 rounded-xl !border-0 bg-transparent p-2 focus:border-none focus:shadow-none focus:shadow-transparent focus:ring-0'
          placeholder='참여 예술가 추가'
          onKeyDown={(e) => {
            if (e.nativeEvent.isComposing) return;
            if (e.key === 'Enter' || e.key == ' ' || e.code == 'Space') {
              handleAddJustName(e.currentTarget.value.replace(regTagExp, ''));
              e.currentTarget.value = '';
            }
          }}
          onChange={(e) => {
            e.currentTarget.value = e.currentTarget.value.replace(
              regTagExp,
              ''
            );
          }}
        />
      </div>
    </div>
  );
}
