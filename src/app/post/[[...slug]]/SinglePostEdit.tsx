import { Button, User } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import TextareaAutoSize from 'react-textarea-autosize';
import { toast } from 'react-toastify';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { SinglePostType } from '@/types/feed';

export default function SinglePostEdit({ feed }: { feed: SinglePostType }) {
  const { push, refresh } = useRouter();
  const [content, setContent] = useState<string>(feed.content);

  const handleEditSave = async () =>
    jxios.put(`/api/posts/${feed.id}`, { content }).then((res) => {
      if (res.status === 200) {
        push(`/post/${feed.id}`);
        refresh();
        toast.success('수정되었습니다.');
      }
    });

  return (
    <div className='mb-2 border-b border-default-200 bg-white transition-colors md:mx-0 md:border-x'>
      <div className='w-full px-3 pt-3'>
        <div>
          <User
            name={feed.authorName}
            description={
              '@' +
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
            className='p-1'
          />
        </div>
        <p className='mx-1.5 mt-1 text-default-500 '>
          {new Date(feed.createdTime).toLocaleString('ko-KR', {
            dateStyle: 'full',
            timeStyle: 'short',
          }) + ' 작성'}
        </p>
        {feed.updatedTime && (
          <p className='mx-1.5 mt-0.5 text-default-500 '>
            {new Date(feed.updatedTime).toLocaleString('ko-KR', {
              dateStyle: 'full',
              timeStyle: 'short',
            }) + ' 수정'}
          </p>
        )}
      </div>
      <TextareaAutoSize
        defaultValue={content}
        autoFocus
        minRows={10}
        className='min-h-12 max-h-max w-full resize-none !border-0 p-3 text-xl focus:border-none focus:shadow-none focus:shadow-transparent focus:ring-0'
        onChange={(e) => {
          setContent(e.currentTarget.value);
        }}
      />
      <div className='sticky bottom-0 flex h-16 w-full items-center justify-end border-t bg-white p-2'>
        <Button color='primary' onClick={handleEditSave}>
          저장
        </Button>
      </div>
    </div>
  );
}
