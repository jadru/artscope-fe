import { Chip, Kbd } from '@nextui-org/react';
import React from 'react';

import { CreateScheduleTempType } from '@/types/event';

type Props = {
  schedule: CreateScheduleTempType[];
  setSchedule: React.Dispatch<React.SetStateAction<CreateScheduleTempType[]>>;
  index: number;
};

const _maxTagCount = 20;

export default function Index({ schedule, setSchedule, index }: Props) {
  const [search, setSearch] = React.useState<string>();

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
    if (!schedule[index].participants.find((item) => item.name === name))
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
    <>
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
            onKeyUp={(e) => {
              e.stopPropagation();
              if (e.nativeEvent.isComposing) return;
              if (search) {
                if (e.currentTarget.value.startsWith('@')) {
                  setSearch(e.currentTarget.value.replace(regTagExp, ''));
                } else {
                  setSearch(undefined);
                }
              } else {
                if (e.key === 'Enter') {
                  const name = e.currentTarget.value.replace(regTagExp, '');
                  handleAddJustName(name);
                  e.currentTarget.value = '';
                }
                if (e.key == ' ' || e.code == 'Space') {
                  e.currentTarget.value = e.currentTarget.value.replace(
                    regTagExp,
                    ''
                  );
                }
                if (e.key === '@' || e.code === 'Digit2') {
                  setSearch('');
                }
              }
            }}
            onChange={(e) => {
              e.currentTarget.value = e.currentTarget.value.replace(
                regTagExp,
                ''
              );
            }}
          />
          {search && (
            <div className='absolute top-7 rounded-xl bg-white px-3 py-3'>
              <p>Artscope 이용자 검색</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
