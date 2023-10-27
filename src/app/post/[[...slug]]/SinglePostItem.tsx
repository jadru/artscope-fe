'use client';

import { convertNewlineToJSX } from '@toss/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import ASNextImage from '@/components/ASNextImage';

import PostComment from '@/app/post/[[...slug]]/comment';
import SinglePostEdit from '@/app/post/[[...slug]]/SinglePostEdit';
import SinglePostItemAction from '@/app/post/[[...slug]]/SinglePostItemAction';
import textInUrlSeperator from '@/utils/textInUrlSeperator';

import { SinglePostType } from '@/types/feed';

export default function SinglePostItem({
  feed,
  editMode,
}: {
  feed: SinglePostType;
  editMode: boolean;
}) {
  const { push } = useRouter();

  return !editMode ? (
    <div>
      <div className='border-default-200 bg-white pb-2 transition-colors md:mx-0 md:border-x'>
        <div className='flex w-full flex-col justify-between p-4 text-left md:flex-row'>
          <div className='w-full'>
            <div
              className='cursor-pointer'
              onClick={(e) => {
                e.stopPropagation();
                push(`/profile/${feed.authorUsername}`);
              }}
            >
              <div
                className='flex flex-row items-start justify-start gap-2 transition hover:underline'
                onClick={(e) => {
                  e.stopPropagation();
                  push(`/profile/${feed.authorUsername}`);
                }}
              >
                <ASNextImage
                  src={
                    feed.authorProfileImageUrl || '/images/default_profile.png'
                  }
                  alt='프로필 사진'
                  width={48}
                  height={48}
                  className='h-12 w-12 rounded-full object-cover'
                />
                <div className='ml-0.5 flex flex-col gap-0.5 transition hover:underline'>
                  <p className='inline text-[0.9rem] font-bold'>
                    {feed.authorName}
                  </p>
                  <p
                    className={`${
                      feed.authorDescription ? 'ml-0.5 inline w-full' : ''
                    } line-clamp-1 text-[0.9rem] text-default-500`}
                  >
                    @{feed.authorUsername}{' '}
                    {feed.authorDescription
                      ? '- ' + feed.authorDescription
                      : ''}
                  </p>
                </div>
              </div>
            </div>

            <div className='flex flex-col justify-start px-1.5 py-3'>
              <div className='text flex w-full flex-col gap-1'>
                <h5 className='w-full overflow-x-hidden break-keep text-lg leading-relaxed tracking-tight text-default-800'>
                  {textInUrlSeperator(
                    feed.content.replace(/<[^>]*>?/g, '')
                  ).map((item, index) => {
                    if (item.type === 'text') {
                      return (
                        <p
                          key={index}
                          className='inline text-lg text-default-800 '
                        >
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
                          className='inline text-lg text-blue-500 hover:underline '
                        >
                          {item.value}
                        </Link>
                      );
                    }
                  })}
                </h5>
              </div>
            </div>
            {feed.updatedTime ? (
              <p className='mx-1.5 mt-0.5 text-right text-default-500'>
                {new Date(feed.updatedTime).toLocaleString('ko-KR', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                }) + ' 수정'}
              </p>
            ) : (
              <p className='mx-1.5 mt-1 text-right text-default-500'>
                {new Date(feed.createdTime).toLocaleString('ko-KR', {
                  dateStyle: 'full',
                  timeStyle: 'short',
                }) + ' 작성'}
              </p>
            )}
          </div>
        </div>
        <SinglePostItemAction feed={feed} />
      </div>
      <PostComment post={feed} />
    </div>
  ) : (
    <SinglePostEdit feed={feed} />
  );
}
