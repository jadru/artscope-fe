import { convertNewlineToJSX } from '@toss/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useLocalStorage from 'use-local-storage';

import ASNextImage from '@/components/ASNextImage';

import FeedListItemAction from '@/app/(feed)/FeedListItemAction';
import textInUrlSeperator from '@/utils/textInUrlSeperator';
import { timeCaculatortoKO } from '@/utils/timeCalculator';

import { feedItemType } from '@/types/feed';

export default function FeedListItem({ feed }: { feed: feedItemType }) {
  const { push } = useRouter();
  const [_, setScrollY] = useLocalStorage('feed_scroll', 0);
  const [readMore, setReadMore] = useState<boolean>(false);

  return (
    <div
      className={`border-default-200 bg-white pb-2 transition-colors md:mx-0 md:border-x ${
        feed.type === 'artwork' ? 'cursor-pointer hover:bg-gray-100' : ''
      }`}
    >
      <div className='flex w-full flex-col justify-between text-left md:flex-row'>
        <div className='w-full'>
          <div className='flex justify-between p-1'>
            <div
              className='flex cursor-pointer items-center gap-2 rounded-3xl border border-white px-2 py-2 transition hover:border-default-400 hover:bg-default-100'
              onClick={(e) => {
                e.stopPropagation();
                setScrollY(window.scrollY);
                push(`/profile/${feed.authorUsername}`);
              }}
            >
              <ASNextImage
                src={feed.authorProfileImageUrl ?? '/images/default.png'}
                alt={feed.authorName}
                width={36}
                height={36}
                className='h-12 w-12 rounded-full bg-gray-300'
              />
              <div>
                <h5 className='text-md inline font-bold'>{feed.authorName}</h5>
                <h5
                  className={`${
                    feed.authorDescription ? 'ml-1 inline' : ''
                  } text-default-500`}
                >
                  @{feed.authorUsername}
                </h5>
                {feed.authorDescription && <h5>{feed.authorDescription}</h5>}
              </div>
            </div>
            <h5 className='mr-3 mt-3 text-default-600'>
              {timeCaculatortoKO(feed.createdTime)}
            </h5>
          </div>
          <div className='flex flex-col justify-start px-5 pb-2'>
            <div className='text flex w-full flex-col gap-1'>
              <h5
                className={`${
                  !readMore && feed.content.length > 130
                    ? 'line-clamp-3 cursor-pointer hover:underline'
                    : ''
                } w-full overflow-x-hidden text-medium leading-normal tracking-tight text-default-800`}
                onClick={() => {
                  setScrollY(window.scrollY);
                  if (!readMore && feed.content.length > 130) setReadMore(true);
                }}
              >
                {feed.type === 'exhibition' ? <b>전시안내 - </b> : ''}
                {!readMore && feed.content.length > 130 ? (
                  <p className='inline text-default-800'>{feed.content}</p>
                ) : (
                  textInUrlSeperator(feed.content).map((item) => {
                    if (item.type === 'text') {
                      return (
                        <p key={item.value} className='inline text-default-800'>
                          {convertNewlineToJSX(item.value)}
                        </p>
                      );
                    } else {
                      return (
                        <Link
                          key={item.value}
                          href={item.value}
                          onClick={(e) => {
                            e.stopPropagation();
                            setScrollY(window.scrollY);
                          }}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='inline text-blue-500 hover:underline'
                        >
                          {item.value}
                        </Link>
                      );
                    }
                  })
                )}
              </h5>
            </div>
          </div>
        </div>
      </div>
      <FeedListItemAction feed={feed} />
    </div>
  );
}
