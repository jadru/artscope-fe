import { Chip, Kbd } from '@nextui-org/react';
import React from 'react';
import { FaHashtag } from 'react-icons/fa';

type Props = {
  tagCount: string[];
  setTagCount: React.Dispatch<React.SetStateAction<string[]>>;
};

const maxTagCount = 20;

export default function NewTagView({ tagCount, setTagCount }: Props) {
  const handleAddTag = (tag: string) => {
    if (tag === '') return;
    tagCount.length === 0
      ? setTagCount([tag])
      : tagCount.filter((item) => item !== tag).length === tagCount.length
      ? setTagCount([...tagCount, tag])
      : '';
  };

  const regTagExp = /[`~!@#$%^&*()_|+\-=?;:'",.<>{}[\]\\/ ]/gim;

  return (
    <div className='flex  flex-wrap'>
      {tagCount &&
        tagCount.map((item) => (
          <Chip
            onClose={() => {
              setTagCount(tagCount.filter((tag) => tag !== item));
            }}
            className='animate-appearance-in m-1 h-8'
            size='lg'
            key={item}
            startContent={<FaHashtag />}>
            {item}
          </Chip>
        ))}
      {tagCount.length < maxTagCount ? (
        <div className='relative m-1 h-8 w-36 rounded-full bg-gray-100'>
          <FaHashtag className='absolute bottom-auto left-2 top-1/2 -translate-y-1/2' />
          <Kbd
            keys={['enter']}
            className='absolute bottom-auto right-2 top-1/2 -translate-y-1/2'></Kbd>
          <input
            className='m-1 ml-5 h-6 max-h-6 w-24 rounded-full !border-0 bg-transparent p-2 focus:border-none focus:shadow-none focus:shadow-transparent focus:ring-0'
            placeholder='태그 추가'
            onKeyDown={(e) => {
              if (
                (e.key === 'Enter' || e.key == ' ' || e.code == 'Space') &&
                !e.nativeEvent.isComposing
              ) {
                handleAddTag(e.currentTarget.value.replace(regTagExp, ''));
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
      ) : (
        ''
      )}
    </div>
  );
}
