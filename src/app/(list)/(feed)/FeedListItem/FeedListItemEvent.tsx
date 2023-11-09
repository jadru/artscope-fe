import Link from 'next/link';

import MarkdownVewer from '@/components/MarkdownViewer';

import { feedItemType } from '@/types/feed';

export default function FeedListItemEvent({ feed }: { feed: feedItemType }) {
  return (
    <Link
      href={`/event/${feed.id}`}
      className='flex w-full cursor-pointer space-x-2 bg-white px-3.5 py-2 transition-colors hover:bg-gray-100 md:mx-0'
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className='flex w-full flex-col justify-between text-left'>
        <div className='line-clamp-3 w-full overflow-x-hidden break-keep tracking-tight text-default-800'>
          <b>새로운 이벤트!</b>
          <h3>{feed.title}</h3>
          <MarkdownVewer content={feed.content} />
        </div>
      </div>
    </Link>
  );
}
