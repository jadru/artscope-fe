import { convertNewlineToJSX } from '@toss/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ASNextImage from '@/components/ASNextImage';

import FeedListItemAction from '@/app/(feed)/FeedListItemAction';
import OpengraphCard from '@/app/(feed)/OpengraphCard';
import textInUrlSeperator from '@/utils/textInUrlSeperator';
import { timeCaculatortoKO } from '@/utils/timeCalculator';

import { feedItemType } from '@/types/feed';

export default function FeedListItem({ feed }: { feed: feedItemType }) {
  const { push } = useRouter();
  const [firstLink, setFirstLink] = useState<string | undefined>();
  const [content, _] = useState(
    textInUrlSeperator(feed.content.replace(/<[^>]*>?/g, ''))
  );

  useEffect(() => {
    for (const item of content) {
      if (item.type === 'link') {
        setFirstLink(item.value);
        break;
      }
    }
  }, [content]);

  return (
    <div
      className='flex cursor-pointer space-x-2 border-b border-default-200 bg-white px-3.5 pb-1 pt-3.5 transition-colors hover:bg-gray-100 md:mx-0 md:border-x'
      onClick={(e) => {
        e.stopPropagation();
        push(`/post/${feed.id}`);
      }}
    >
      <div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            push(`/profile/${feed.authorUsername}`);
          }}
          className='bg-dark flex-shrink-0 overflow-hidden rounded-full border border-transparent transition hover:border-default-500 hover:opacity-80'
        >
          <ASNextImage
            src={feed.authorProfileImageUrl ?? '/images/default.png'}
            alt={feed.authorName}
            width={40}
            height={40}
            className='h-10 w-10 rounded-full bg-gray-300 object-cover'
          />
        </button>
      </div>
      <div className='flex w-[calc(100%-3rem)] flex-col justify-between text-left'>
        <div className='w-full space-y-1'>
          <div className='flex justify-between'>
            <div
              className='flex gap-1 transition hover:underline'
              onClick={(e) => {
                e.stopPropagation();
                push(`/profile/${feed.authorUsername}`);
              }}
            >
              <p className='inline text-[0.9rem] font-bold'>
                {feed.authorName}
              </p>
              <p
                className={`${
                  feed.authorDescription ? 'ml-1 inline' : ''
                } text-[0.9rem] text-default-500`}
              >
                @{feed.authorUsername}
              </p>
            </div>
            <h5 className='text-[0.9rem] text-default-600'>
              {timeCaculatortoKO(feed.createdTime)}
            </h5>
          </div>
          <div className='flex flex-col justify-start'>
            <div className='text flex w-full flex-col gap-1'>
              <h5 className='line-clamp-3 w-full overflow-x-hidden leading-normal tracking-tight text-default-800'>
                {feed.type === 'exhibition' ? <b>전시안내 - </b> : ''}
                {content.map((item, index) => {
                  if (item.type === 'text') {
                    return (
                      <p
                        key={item.value + '-' + index}
                        className='inline text-default-800'
                      >
                        {convertNewlineToJSX(item.value)}
                      </p>
                    );
                  } else {
                    return (
                      <Link
                        key={item.value + '-' + index}
                        href={item.value}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='inline text-blue-500 hover:underline'
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {item.value}
                      </Link>
                    );
                  }
                })}
              </h5>
            </div>
            {firstLink && <OpengraphCard externalUrl={firstLink} />}
          </div>
        </div>
        <FeedListItemAction feed={feed} />
      </div>
    </div>
  );
}
