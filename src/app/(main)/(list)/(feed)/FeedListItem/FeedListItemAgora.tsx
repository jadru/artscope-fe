import Link from 'next/link';
import React from 'react';
import { BiConfused, BiHappy, BiMeh } from 'react-icons/bi';

import ASNextImage from '@/components/ASNextImage';
import MarkdownViewer from '@/components/MarkdownViewer';
import StandardLabel from '@/components/StandardLabel';

import { editAndPostShortCalculatorKO } from '@/utils/timeCalculator';

import { feedItemType } from '@/types/feed';

export default function FeedListItemAgora({ feed }: { feed: feedItemType }) {
  return (
    <Link
      href={`/agora/${feed.id}`}
      className='flex w-full cursor-pointer space-x-2 rounded-xl bg-white px-3.5 py-3 transition-colors hover:bg-gray-100 md:mx-0'
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className='flex w-full flex-col justify-between text-left'>
        <div className='flex justify-between'>
          <div
            className={`flex flex-col justify-between overflow-x-hidden break-keep tracking-tight text-default-800 ${
              feed.thumbnailUrl ? 'w-[calc(100%-3rem)]' : 'w-full'
            }`}
          >
            <div className='line-clamp-3'>
              <h4 className='flex w-full justify-between text-[1.1rem]'>
                <StandardLabel label={feed.title} />{' '}
                <span className='text-right font-normal text-default-500'>
                  {editAndPostShortCalculatorKO(
                    feed.createdTime,
                    feed.updatedTime
                  )}
                </span>
              </h4>
              <MarkdownViewer className='line-clamp-2 leading-5 text-default-600 peer-default:!text-[0.9rem]'>
                {feed.content}
              </MarkdownViewer>
            </div>
            <div className='mt-2 flex flex-col justify-start gap-0.5'>
              <p className='flex items-center gap-1 text-lg text-red-600'>
                <BiConfused size={20} />{' '}
                <StandardLabel label={feed.agreeText} />{' '}
                {feed.agoraDisagreeCount}
              </p>
              <p className='flex items-center gap-1 text-lg text-yellow-600'>
                <BiMeh size={20} /> <StandardLabel label={feed.naturalText} />{' '}
                {feed.agoraNaturalCount}
              </p>
              <p className='flex items-center gap-1 text-lg text-blue-500'>
                <BiHappy size={20} />{' '}
                <StandardLabel label={feed.disagreeText} />{' '}
                {feed.agoraAgreeCount}
              </p>
            </div>
          </div>
          {feed.thumbnailUrl && (
            <div className='flex'>
              <ASNextImage
                className='ml-2 h-24 w-24 rounded-lg border object-cover drop-shadow-xl'
                src={feed.thumbnailUrl}
                alt={feed.content}
                width={96}
                height={96}
              />
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
