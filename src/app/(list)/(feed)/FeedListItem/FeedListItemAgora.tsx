import Link from 'next/link';
import { BiConfused, BiHappy, BiMeh } from 'react-icons/bi';

import ASNextImage from '@/components/ASNextImage';
import MarkdownViewer from '@/components/MarkdownViewer';

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
          <div className='flex w-3/4 flex-col justify-between overflow-x-hidden break-keep tracking-tight text-default-800'>
            <div className='line-clamp-3'>
              <h4 className='text-[1.1rem]'>{feed.title}</h4>
              <MarkdownViewer className='line-clamp-2 leading-5 text-default-600 peer-default:!text-[0.9rem]'>
                {feed.content}
              </MarkdownViewer>
            </div>
            <div className='mt-1 flex justify-start gap-3'>
              <p className='flex items-center gap-1 text-lg text-red-600'>
                <BiConfused size={20} /> {feed.agoraDisagreeCount}
              </p>
              <p className='flex items-center gap-1 text-lg text-yellow-600'>
                <BiMeh size={20} /> {feed.agoraNaturalCount}
              </p>
              <p className='flex items-center gap-1 text-lg text-blue-500'>
                <BiHappy size={20} /> {feed.agoraAgreeCount}
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
