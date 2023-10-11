import { Button, User } from '@nextui-org/react';
import { DebounceClick } from '@toss/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineLike,
  AiOutlineMessage,
  AiOutlineShareAlt,
  AiOutlineStar,
} from 'react-icons/ai';
import { toast } from 'react-toastify';
import { RWebShare } from 'react-web-share';

import {
  NEXT_PUBLIC_MEDIA_STORAGE_URL,
  NEXT_PUBLIC_ROOT_URL,
} from '@/constant/env';
import { useUser } from '@/states';

import { feedItemType } from '@/types';

export default function FeedListItem({
  feed,
  isSinglePost = false,
}: {
  feed: feedItemType;
  isSinglePost?: boolean;
}) {
  const { push } = useRouter();
  const { user } = useUser();
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

  const handleLike = () => {
    toast('좋아요 누름');
  };

  const handleComment = () => {
    toast('댓글 누름');
  };

  const handleSave = () => {
    toast('저장 누름');
  };

  return (
    <div
      className={`border-x border-default-200 bg-white p-4 pb-2 transition-colors md:mx-0 ${
        feed.type === 'artwork' ? 'cursor-pointer hover:bg-gray-100' : ''
      }`}
      onClick={() => {
        if (feed.type === 'artwork') push(`/artwork/${feed.id}`);
      }}
    >
      <div className='flex w-full flex-col justify-between text-left md:flex-row'>
        <div className='w-full'>
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
                  if (!readMore && feed.content.length > 130) setReadMore(true);
                }}
              >
                {feed.type === 'exhibition' ? <b>전시안내 - </b> : ''}
                {!isSinglePost && !readMore && feed.content.length > 130
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
        <DebounceClick wait={500}>
          <Button
            startContent={<AiOutlineLike className='h-5 w-5' />}
            variant='light'
            className='text-md text-gray-500 hover:text-red-500'
            onClick={handleLike}
          >
            {feed.likes}
          </Button>
        </DebounceClick>
        <DebounceClick wait={500}>
          <Button
            startContent={<AiOutlineMessage className='h-5 w-5' />}
            variant='light'
            className='text-md text-gray-500 hover:text-blue-500'
            onClick={handleComment}
          >
            {feed.likes}
          </Button>
        </DebounceClick>
        <DebounceClick wait={500}>
          <Button
            startContent={<AiOutlineStar className='h-5 w-5' />}
            variant='light'
            className='text-md text-gray-500 hover:text-green-500'
            onClick={handleSave}
          >
            {feed.likes}
          </Button>
        </DebounceClick>
        <DebounceClick wait={500}>
          <RWebShare
            data={{
              text: 'Artscope - ' + feed.content.slice(0, 70),
              url: NEXT_PUBLIC_ROOT_URL + '/post/' + feed.id,
              title: feed.content.slice(0, 15) + '... | Artscope',
            }}
          >
            <Button
              startContent={<AiOutlineShareAlt className='h-5 w-5' />}
              variant='light'
              className='text-md text-gray-500 hover:text-amber-600'
              onClick={handleSave}
            >
              공유
            </Button>
          </RWebShare>
        </DebounceClick>
        {feed.authorUsername === user?.username && (
          <>
            <DebounceClick wait={500}>
              <Button
                startContent={<AiOutlineEdit className='h-5 w-5' />}
                variant='light'
                className='text-md text-gray-500 hover:text-purple-500'
                onClick={(e) => {
                  e.stopPropagation();
                  toast('수정 누름');
                }}
              >
                수정
              </Button>
            </DebounceClick>
            <DebounceClick wait={500}>
              <Button
                startContent={<AiOutlineDelete className='h-5 w-5' />}
                variant='light'
                className='text-md text-gray-500 hover:text-red-500'
                onClick={(e) => {
                  e.stopPropagation();
                  toast('삭제 누름');
                }}
              >
                삭제
              </Button>
            </DebounceClick>
          </>
        )}
      </div>
    </div>
  );
}
