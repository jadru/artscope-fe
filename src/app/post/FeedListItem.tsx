import { Button, User } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { AiFillHeart, AiFillMessage, AiFillStar } from 'react-icons/ai';
import { toast } from 'react-toastify';

import { feedItemType } from '@/types';

export default function FeedListItem({ feed }: { feed: feedItemType }) {
  const { push } = useRouter();
  const [readMore, setReadMore] = useState<boolean>(false);

  const extractLinks = (
    text: string
  ): { type: 'text' | 'link'; value: string }[] => {
    const linkRegex = /(https:\/\/\S+)/g;
    const matches = text.match(linkRegex);

    if (!matches) {
      return [{ type: 'text', value: text }];
    }

    const result: { type: 'text' | 'link'; value: string }[] = [];

    let lastIndex = 0;
    for (const match of matches) {
      const startIndex = text.indexOf(match, lastIndex);
      if (startIndex > lastIndex) {
        // 링크 이전의 텍스트를 배열에 추가
        const textBeforeLink = text.substring(lastIndex, startIndex);
        result.push({ type: 'text', value: textBeforeLink });
      }

      // 링크를 배열에 추가
      result.push({ type: 'link', value: decodeURI(match) });

      lastIndex = startIndex + match.length;
    }

    // 마지막 링크 이후의 텍스트를 배열에 추가
    if (lastIndex < text.length) {
      const textAfterLink = text.substring(lastIndex);
      result.push({ type: 'text', value: textAfterLink });
    }

    return result;
  };

  return (
    <div
      className={`border-x border-b border-default-200 bg-white p-4 pb-2 transition-colors md:mx-0 ${
        feed.type === 'artwork' ? 'cursor-pointer hover:bg-gray-100' : ''
      }`}
      onClick={() => {
        if (feed.type === 'artwork') push(`/artwork/${feed.id}`);
      }}
    >
      <div className='flex w-full flex-col justify-between text-left md:flex-row'>
        <div>
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
                  ? feed.authorProfileImageUrl
                  : undefined,
              }}
              className='p-1 hover:underline'
            />
          </div>
          <div className='flex flex-col justify-start px-1.5 py-3'>
            <div className='text flex w-full flex-col gap-1'>
              {feed.title && (
                <h4 className='w-full text-xl font-semibold text-default-600'>
                  {feed.title}
                </h4>
              )}
              <h5
                className={`${
                  !readMore && feed.content.length > 130
                    ? 'cursor-pointer hover:underline'
                    : ''
                } w-full overflow-x-hidden text-medium tracking-tight text-default-800`}
                onClick={() => {
                  if (!readMore && feed.content.length > 130) setReadMore(true);
                }}
              >
                {!readMore && feed.content.length > 130
                  ? feed.content.slice(0, 130) + '... 더보기'
                  : extractLinks(feed.content).map((item, index) => {
                      if (item.type === 'text') {
                        return (
                          <span key={index} className='text-default-800'>
                            {item.value}
                          </span>
                        );
                      } else {
                        return (
                          <Link
                            key={item.value}
                            href={item.value}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500 hover:underline'
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
      <div className='w-full justify-evenly gap-1 self-start md:w-auto md:justify-items-start'>
        <Button
          startContent={<AiFillHeart className='h-5 w-5' />}
          variant='light'
          className='text-md text-gray-500 hover:text-red-500'
          onClick={(e) => {
            e.stopPropagation();
            toast('좋아요 누름');
          }}
        >
          {feed.likes}
        </Button>
        <Button
          startContent={<AiFillMessage className='h-5 w-5' />}
          variant='light'
          className='text-md text-gray-500 hover:text-blue-500'
          onClick={(e) => {
            e.stopPropagation();
            toast('댓글 누름');
          }}
        >
          {feed.likes}
        </Button>
        <Button
          startContent={<AiFillStar className='h-5 w-5' />}
          variant='light'
          className='text-md text-gray-500 hover:text-green-500'
          onClick={(e) => {
            e.stopPropagation();
            toast('저장 누름');
          }}
        >
          {feed.likes}
        </Button>
      </div>
    </div>
  );
}
