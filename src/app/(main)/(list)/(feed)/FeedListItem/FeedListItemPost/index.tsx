import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import ASNextImage from '@/components/ASNextImage';
import MarkdownViewer from '@/components/MarkdownViewer';
import StandardLabel from '@/components/StandardLabel';

import FeedListItemPostAction from '@/app/(main)/(list)/(feed)/FeedListItem/FeedListItemPost/FeedListItemPostAction';
import FeedListItemPostMedia from '@/app/(main)/(list)/(feed)/FeedListItem/FeedListItemPost/FeedListItemPostMedia';
import OpengraphCard from '@/app/(main)/(list)/(feed)/OpengraphCard';
import { timeCaculatortoKO } from '@/utils/timeCalculator';

import { feedItemType } from '@/types/feed';

export default function Index({ feed }: { feed: feedItemType }) {
  const { push } = useRouter();
  const [firstLink, setFirstLink] = useState<string | undefined>();

  useEffect(() => {
    const linkRegex = /(https:\/\/\S+)/g;
    const matches = feed.content.match(linkRegex);
    if (!matches) return;
    setFirstLink(matches[0]);
  }, [feed.content]);

  return (
    <div
      className='flex cursor-pointer space-x-2 rounded-xl px-3 pb-1 pt-3 transition-colors hover:bg-gray-100 md:mx-0'
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
            src={feed.authorProfileImageUrl ?? 'prod/images/default.jpg'}
            alt={feed.authorName}
            width={40}
            height={40}
            className='h-10 w-10 rounded-full border border-default-400 bg-gray-300 object-cover'
          />
        </button>
      </div>
      <div className='flex w-[calc(100%-3rem)] flex-col justify-between text-left'>
        <div className='w-full space-y-1'>
          <div className='flex justify-between'>
            <div
              className='group flex gap-1'
              onClick={(e) => {
                e.stopPropagation();
                push(`/profile/${feed.authorUsername}`);
              }}
            >
              <p className='inline text-[0.9rem] font-bold transition group-hover:underline'>
                <StandardLabel label={feed.authorName} />
              </p>
              <p className='text-[0.9rem] text-default-500 transition group-hover:text-default-900'>
                @{feed.authorUsername}
              </p>
            </div>
            <h5 className='text-[0.9rem] text-default-600'>
              {timeCaculatortoKO(feed.createdTime)}
            </h5>
          </div>
          <div className='flex flex-col justify-start'>
            <div className='text flex w-full flex-col gap-1'>
              <MarkdownViewer className='line-clamp-2 leading-5 text-default-600 peer-default:!text-[0.9rem]'>
                {feed.content}
              </MarkdownViewer>
            </div>
            {firstLink && <OpengraphCard externalUrl={firstLink} />}
            {feed.mediaUrls && feed.mediaUrls.length > 0 && (
              <FeedListItemPostMedia feed={feed} />
            )}
          </div>
        </div>
        <FeedListItemPostAction feed={feed} />
      </div>
    </div>
  );
}
