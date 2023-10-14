import { Button, Input } from '@nextui-org/react';
import { useDebounce } from '@toss/react';
import { useRouter } from 'next/navigation';
import React, { ChangeEvent, useRef, useState } from 'react';

import ASNextImage from '@/components/ASNextImage';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';
import { timeCaculatortoKO } from '@/utils/timeCalculator';

import { SinglePostType } from '@/types';

export default function PostComment({
  post: PostData,
}: {
  post: SinglePostType;
}) {
  const [post, setPostData] = useState<SinglePostType>(PostData);
  const [toComment, setTocomment] = useState<number>(PostData.id);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { user, isLogin } = useUser();
  const { push } = useRouter();
  const [content, setContent] = useState<string>('');

  const handleCommentContentInput = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const submitComment = useDebounce(
    () =>
      content !== '' &&
      jxios
        .post(`/api/posts/${toComment}/comments`, { content })
        .then((res) => {
          setContent('');
          const newPostData = res.data as SinglePostType;
          if (newPostData.id === PostData.id) setPostData(newPostData);
          else
            setPostData((prev) => {
              return {
                ...prev,
                commentPosts: prev.commentPosts.map((comment) => {
                  if (comment.id === toComment) {
                    return newPostData;
                  }
                  return comment;
                }),
              };
            });
          setTocomment(PostData.id);
        }),
    300
  );

  const handleCommentDelete = (id: number) => {
    if (confirm('댓글을 정말 삭제하시겠습니까?'))
      jxios.delete(`/api/posts/${id}`).then((res) => {
        if (res.status === 200)
          setPostData({
            ...post,
            commentPosts: post.commentPosts.filter(
              (comment) => comment.id !== id
            ),
          });
      });
  };

  return (
    <div className='space-y-2 border-t px-2 py-4 md:border' ref={ref}>
      <h4 className='px-2 text-3xl'>댓글 {post.commentPosts.length}</h4>
      {isLogin && (
        <div className='flex px-2'>
          <Input
            ref={inputRef}
            placeholder={
              toComment === post.id
                ? '댓글을 입력하세요'
                : post.commentPosts.find((comment) => comment.id === toComment)
                    ?.authorName + '님에게 답글을 남겨보세요'
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
          <Button
            className='ml-2'
            color='primary'
            size='lg'
            onClick={submitComment}
          >
            작성
          </Button>
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
                  <h5 className='ml-2 text-gray-500'>
                    {timeCaculatortoKO(comment.updatedTime) ??
                      timeCaculatortoKO(comment.createdTime)}
                  </h5>
                  <h5
                    className='ml-2 cursor-pointer font-bold text-gray-500 hover:underline'
                    onClick={() => {
                      setTocomment(comment.id);
                      inputRef.current?.scrollIntoView({ behavior: 'smooth' });
                      inputRef.current?.focus();
                    }}
                  >
                    댓글
                  </h5>
                  {user.username === comment.authorUsername && (
                    <h5
                      className='ml-2 cursor-pointer text-lg font-bold text-gray-500 hover:underline'
                      onClick={() => handleCommentDelete(comment.id)}
                    >
                      삭제
                    </h5>
                  )}
                </div>
                <p className='break-words'>{comment.content}</p>
              </div>
            </div>
            {comment.commentPosts && comment.commentPosts.length > 0 && (
              <div className='ml-8 flex flex-col gap-2'>
                {comment.commentPosts.map((reComment) => (
                  <div
                    key={reComment.id}
                    className='flex px-2 py-3 hover:bg-default-100'
                  >
                    <ASNextImage
                      src={
                        reComment.authorProfileImageUrl ?? '/images/default.png'
                      }
                      alt={reComment.authorName}
                      width={48}
                      height={48}
                      className='h-12 w-12 rounded-full bg-gray-300'
                    />
                    <div className='flex w-[calc(100%-48px)] flex-col pl-2'>
                      <div className='flex'>
                        <h5 className='text-lg font-bold'>
                          {reComment.authorName}
                        </h5>
                        <h5 className='ml-2 text-gray-500'>
                          {timeCaculatortoKO(reComment.updatedTime) ??
                            timeCaculatortoKO(reComment.createdTime)}
                        </h5>
                        {user.username === reComment.authorUsername && (
                          <h5
                            className='ml-2 cursor-pointer text-lg font-bold text-gray-500 hover:underline'
                            onClick={() => handleCommentDelete(reComment.id)}
                          >
                            삭제
                          </h5>
                        )}
                      </div>
                      <p className='break-words'>
                        <span
                          className='cursor-pointer font-bold text-default-600 hover:underline'
                          onClick={() =>
                            push('/profile/' + comment.authorUsername)
                          }
                        >
                          @{comment.authorUsername}
                        </span>{' '}
                        {reComment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {index + 1 !== post.commentPosts.length && (
              <hr key={comment.id + '-divider'} />
            )}
          </>
        ))}
      </div>
    </div>
  );
}
