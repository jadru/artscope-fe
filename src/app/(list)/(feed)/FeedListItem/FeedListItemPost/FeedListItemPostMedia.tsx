import ASNextImage from '@/components/ASNextImage';

import { feedItemType } from '@/types/feed';

export default function FeedListItemPostMedia({
  feed,
}: {
  feed: feedItemType;
}) {
  return (
    <div className='mt-3 flex flex-wrap gap-1'>
      {feed.mediaUrls &&
        feed.mediaUrls.slice(1, 5).map((item, index) => (
          <>
            {index < 3 && (
              <ASNextImage
                key={item}
                src={item}
                alt={feed.authorName + '의 사진'}
                width={100}
                height={100}
                className='h-20 w-[calc(25%-0.25rem)] rounded-lg border object-cover md:h-28'
              />
            )}
            {index === 3 && (
              <div
                className='relative h-20 w-[calc(25%-0.25rem)] md:h-28'
                key={item}
              >
                <ASNextImage
                  src={item}
                  alt={feed.authorName + '의 사진'}
                  width={100}
                  height={100}
                  className='h-full w-full rounded-lg border object-cover'
                />
                <div className='absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-lg border bg-default-100/80 text-3xl font-bold'>
                  + {feed.mediaUrls && feed.mediaUrls.length - 4}
                </div>
              </div>
            )}
          </>
        ))}
    </div>
  );
}
