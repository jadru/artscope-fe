import Link from 'next/link';
import React from 'react';
import { BiConfused, BiHappy, BiMeh } from 'react-icons/bi';

import ASNextImage from '@/components/ASNextImage';
import MarkdownViewer from '@/components/MarkdownViewer';
import StandardLabel from '@/components/StandardLabel';

import { editAndPostShortCalculatorKO } from '@/utils/timeCalculator';

import { AgoraType } from '@/types/agora';

export default function AgoraItem({ agora }: { agora: AgoraType }) {
  return (
    <Link href={'/agora/' + agora.id}>
      <div className='hover:bg-default-100 flex justify-between rounded-2xl p-4 transition'>
        <div
          className={`flex w-4/5 flex-col justify-between ${
            agora.thumbnail?.mediaUrl ? 'w-[calc(100%-3rem)]' : 'w-full'
          }`}
        >
          <div>
            <h4 className='flex w-full justify-between text-[1.1rem]'>
              <StandardLabel label={agora.title} />{' '}
              <span className='text-default-500 text-right font-normal'>
                {editAndPostShortCalculatorKO(
                  agora.createdTime,
                  agora.updatedTime
                )}
              </span>
            </h4>
            <div className='line-clamp-2'>
              <MarkdownViewer>{agora.content}</MarkdownViewer>
            </div>
          </div>
          <div className='mt-2 flex flex-col justify-start gap-0.5'>
            <p className='flex items-center gap-1 text-lg text-red-600'>
              <BiConfused size={20} /> {agora.disagreeText}{' '}
              {agora.disagreeCount}
            </p>
            <p className='flex items-center gap-1 text-lg text-yellow-600'>
              <BiMeh size={20} /> {agora.naturalText} {agora.naturalCount}
            </p>
            <p className='flex items-center gap-1 text-lg text-blue-500'>
              <BiHappy size={20} />
              {agora.disagreeText} {agora.agreeCount}
            </p>
          </div>
        </div>
        <div className='flex'>
          {agora.thumbnail?.mediaUrl && (
            <ASNextImage
              className='ml-2 h-28 w-28 rounded-lg border object-cover drop-shadow-xl'
              src={agora.thumbnail.mediaUrl}
              alt={agora.title}
              width={112}
              height={112}
            />
          )}
        </div>
      </div>
    </Link>
  );
}
