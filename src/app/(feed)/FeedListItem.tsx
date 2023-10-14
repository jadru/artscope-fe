import { User } from '@nextui-org/react';
import { convertNewlineToJSX } from '@toss/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useLocalStorage from 'use-local-storage';

import FeedListItemAction from '@/app/(feed)/FeedListItemAction';
import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import textInUrlSeperator from '@/utils/textInUrlSeperator';

import { feedItemType } from '@/types';

export default function FeedListItem({ feed }: { feed: feedItemType }) {
  const { push } = useRouter();
  const [_, setScrollY] = useLocalStorage('feed_scroll', 0);
  const [readMore, setReadMore] = useState<boolean>(false);

  const timeCaculator = (from: Date): string => {
    const time = new Date(String(from));
    const now = new Date();
    const diff = now.getTime() - time.getTime();
    const diffDay = diff / (1000 * 60 * 60 * 24);
    const diffHour = diff / (1000 * 60 * 60);

    if (diffDay > 365) {
      return time.toLocaleString('ko-KR');
    }
    if (diffDay > 30) {
      return time.toLocaleString('ko-KR');
    }
    if (diffDay > 1) {
      return Math.floor(diffDay) + '일 전';
    }
    if (diffHour > 1) {
      return Math.floor(diffHour) + '시간 전';
    }
    if (diff > 30) {
      return Math.floor(diff / (1000 * 60)) + '분 전';
    }
    return '방금';
  };

  return (
    <div
      className={`border-default-200 bg-white p-4 pb-2 transition-colors md:mx-0 md:border-x ${
        feed.type === 'artwork' ? 'cursor-pointer hover:bg-gray-100' : ''
      }`}
    >
      <div className='flex w-full flex-col justify-between text-left md:flex-row'>
        <div className='w-full'>
          <div
            className='cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              setScrollY(window.scrollY);
              push(`/profile/${feed.authorUsername}`);
            }}
          >
            <User
              name={feed.authorName}
              description={
                timeCaculator(feed.createdTime) +
                ' @' +
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
              <h5
                className={`${
                  !readMore && feed.content.length > 130
                    ? 'cursor-pointer hover:underline'
                    : ''
                } w-full overflow-x-hidden text-base text-medium leading-normal tracking-tight text-default-800`}
                onClick={() => {
                  setScrollY(window.scrollY);
                  if (!readMore && feed.content.length > 130) setReadMore(true);
                }}
              >
                {feed.type === 'exhibition' ? <b>전시안내 - </b> : ''}
                {!readMore && feed.content.length > 130
                  ? feed.content.slice(0, 130) + '... 더보기'
                  : textInUrlSeperator(feed.content).map((item, index) => {
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
                    })}
              </h5>
            </div>
          </div>
        </div>
      </div>
      <FeedListItemAction feed={feed} />
    </div>
  );
}
