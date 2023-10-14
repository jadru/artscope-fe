import { Button, Input } from '@nextui-org/react';
import { DebounceClick } from '@toss/react';
import React, { ChangeEvent, useState } from 'react';

import ASNextImage from '@/components/ASNextImage';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { SinglePostType } from '@/types';

export default function Comment({ post }: { post: SinglePostType }) {
  const { isLogin } = useUser();
  const [content, setContent] = useState<string>('');

  const handleCommentContentInput = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const submitComment = () =>
    content !== '' &&
    jxios.post(`/api/posts/${post.id}/comments`, { content }).then((res) => {
      setContent('');
      const newPostData = res.data as SinglePostType;
      if (newPostData.id === post.id)
        post.commentPosts = newPostData.commentPosts;
      else post.commentPosts.push(res.data);
    });

  return (
    <div className='space-y-2 border-t px-2 py-4 md:border'>
      <h4 className='px-2 text-3xl'>댓글 {post.commentPosts.length}</h4>
      {isLogin && (
        <div className='flex px-2'>
          <Input
            placeholder={
              post.commentPosts.length === 0
                ? '첫 댓글을 남겨보세요'
                : '댓글을 입력하세요'
            }
            variant='bordered'
            value={content}
            onChange={handleCommentContentInput}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                submitComment();
              }
            }}
            size='lg'
          />
          <DebounceClick wait={500}>
            <Button
              className='ml-2'
              color='primary'
              size='lg'
              onClick={submitComment}
            >
              작성
            </Button>
          </DebounceClick>
        </div>
      )}
      <div className=''>
        {post.commentPosts.map((comment, index) => (
          <>
            <div
              key={comment.id}
              className='flex px-2 py-3 hover:bg-default-100'
            >
              <ASNextImage
                src={comment.authorProfileImageUrl ?? '/images/default.png'}
                alt={comment.authorName}
                width={48}
                height={48}
                className='h-12 w-12 rounded-full bg-gray-300'
              />
              <div className='flex w-[calc(100%-48px)] flex-col pl-2'>
                <div className='flex'>
                  <h5 className='text-lg font-bold'>{comment.authorName}</h5>
                  <h5 className='ml-2 text-lg text-gray-500'>
                    @{comment.authorUsername}
                  </h5>
                </div>
                <p className='break-words'>{comment.content}</p>
              </div>
            </div>
            {index + 1 !== post.commentPosts.length && (
              <hr key={comment.id + '-divider'} />
            )}
          </>
        ))}
      </div>
    </div>
  );
}
