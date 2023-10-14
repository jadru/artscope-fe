'use client';

import { User } from '@nextui-org/react';
import { convertNewlineToJSX } from '@toss/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import PostComment from '@/app/post/[[...slug]]/PostComment';
import SinglePostItemAction from '@/app/post/[[...slug]]/SinglePostItemAction';
import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import textInUrlSeperator from '@/utils/textInUrlSeperator';

import { SinglePostType } from '@/types';

export default function SinglePostItem({
  feed,
  editMode,
}: {
  feed: SinglePostType;
  editMode: boolean;
}) {
  const { push } = useRouter();
  const [_, setEdit] = useState<boolean>(editMode);

  return (
    <div>
      <div
        className={`border-default-200 bg-white pb-2 transition-colors md:mx-0
      md:border-x`}
      >
        <div className='flex w-full flex-col justify-between p-4 text-left md:flex-row'>
          <div className='w-full'>
            <div
              className='cursor-pointer'
              onClick={(e) => {
                e.stopPropagation();
                push(`/profile/${feed.authorUsername}`);
              }}
            >
              <User
                name={feed.authorName}
                description={
                  '@' +
                  feed.authorUsername +
                  (feed.authorDescription ? ' - ' + feed.authorDescription : '')
                }
                avatarProps={{
                  src: feed.authorProfileImageUrl
                    ? feed.authorProfileImageUrl.startsWith('http')
                      ? feed.authorProfileImageUrl
                      : NEXT_PUBLIC_MEDIA_STORAGE_URL +
                        '/' +
                        feed.authorProfileImageUrl
                    : undefined,
                }}
                className='p-1 hover:underline'
              />
            </div>
            <div className='flex flex-col justify-start px-1.5 py-3'>
              <div className='text flex w-full flex-col gap-1'>
                <h5 className='w-full overflow-x-hidden text-base text-medium leading-normal tracking-tight text-default-800'>
                  {textInUrlSeperator(feed.content).map((item, index) => {
                    if (item.type === 'text') {
                      return (
                        <p key={index} className='inline text-default-800'>
                          {convertNewlineToJSX(item.value)}
                        </p>
                      );
                    } else {
                      return (
                        <Link
                          key={item.value}
                          href={item.value}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline text-blue-500 hover:underline'
                        >
                          {item.value}
                        </Link>
                      );
                    }
                  })}
                </h5>
              </div>
            </div>
            <p className='text-md px-1.5 text-left font-bold text-default-600'>
              {feed.updatedTime
                ? new Date(feed.updatedTime).toLocaleString('ko-KR', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  }) + ' 편집됨'
                : new Date(feed.createdTime).toLocaleString('ko-KR', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  }) + ' 작성'}
            </p>
          </div>
        </div>
        <SinglePostItemAction feed={feed} setEditMode={setEdit} />
      </div>
      <PostComment post={feed} />
    </div>
  );
}
