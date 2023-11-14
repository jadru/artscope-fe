import Link from 'next/link';

import MarkdownVewer from '@/components/MarkdownViewer';

import { feedItemType } from '@/types/feed';

export default function FeedListItemAgora({ feed }: { feed: feedItemType }) {
  return (
    <Link
      href={`/agora/${feed.id}`}
      className='flex w-full cursor-pointer space-x-2 bg-white px-3.5 py-2 transition-colors hover:bg-gray-100 md:mx-0'
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className='flex w-full flex-col justify-between text-left'>
        <div className='flex justify-between'>
          <div className='line-clamp-3 w-3/4 overflow-x-hidden break-keep tracking-tight text-default-800'>
            <h4 className='text-[1.1rem]'>{feed.title}</h4>
            <MarkdownVewer content={feed.content} />
          </div>
          <h3 className='w-1/4 pl-1 text-right font-normal'>
            {feed.participantCount}명 참여
          </h3>
        </div>
        <div className='mt-1 flex justify-between gap-1'>
          <p className='truncate border-l-3 border-red-600 bg-default-100 px-2 font-bold'>
            {feed.disagreeText} : {feed.agoraDisagreeCount}
          </p>
          <p className='truncate border-l-3 border-yellow-400 bg-default-100 px-2 font-bold'>
            {feed.naturalText} : {feed.agoraNaturalCount}
          </p>
          <p className='truncate border-l-3 border-blue-600 bg-default-100 px-2 font-bold'>
            {feed.agreeText} : {feed.agoraAgreeCount}
          </p>
        </div>
      </div>
    </Link>
  );
}
