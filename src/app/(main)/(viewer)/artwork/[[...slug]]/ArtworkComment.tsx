'use client';

import { Button, Input } from '@nextui-org/react';
import { useDebounce } from '@toss/react';
import React, { ChangeEvent, useState } from 'react';

import ASNextImage from '@/components/ASNextImage';
import LoginNeeded from '@/components/LoginNeeded';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';
import { editAndPostTimeCalculatorKO } from '@/utils/timeCalculator';

import { ArtworkType } from '@/types/artwork';

export default function ArtworkComment({ aw: awData }: { aw: ArtworkType }) {
  const [aw, setAwData] = useState<ArtworkType>(awData);
  const { user, isLogin, isAdmin } = useUser();
  const [content, setContent] = useState<string>('');

  const handleCommentContentInput = (e: ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const submitComment = useDebounce(
    () =>
      content !== '' &&
      jxios
        .post(`/api/artworks/${aw.artwork.id}/comments`, { content })
        .then((res) => {
          setContent('');
          setAwData((prev) => ({
            ...prev,
            artwork: res.data as ArtworkType['artwork'],
          }));
        }),
    300
  );

  const handleCommentDelete = (id: number) => {
    if (confirm('댓글을 정말 삭제하시겠습니까?'))
      jxios
        .delete(`/api/artworks/${aw.artwork.id}/comments/${id}`)
        .then((res) => {
          if (res.status === 204)
            setAwData((prev) => ({
              ...prev,
              artwork: {
                ...prev.artwork,
                artworkComments: prev.artwork.artworkComments.filter(
                  (comment) => comment.id !== id
                ),
              },
            }));
        });
  };

  return (
    <div className='space-y-1.5 rounded-xl border-2 px-2 py-3'>
      <h3 className='font-normal'>댓글 {aw.artwork.artworkComments.length}</h3>
      {isLogin && (
        <div className='flex px-2'>
          <Input
            placeholder={
              aw.artwork.artworkComments.length === 0
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
          />
          <Button
            className='ml-2 h-14'
            color='primary'
            size='lg'
            onClick={submitComment}
          >
            작성
          </Button>
        </div>
      )}
      <LoginNeeded href='/user/login' />
      {isLogin && aw.artwork.comments === 0 && (
        <p className='p-4 text-center'>첫 댓글을 작성해보세요</p>
      )}
      <div className='flex w-full flex-col items-stretch gap-1.5'>
        {aw.artwork.artworkComments.map((comment) => (
          <div key={comment.id}>
            <div className='flex rounded-xl bg-default-100 px-2 py-3'>
              <ASNextImage
                src={comment.authorProfileImageUrl ?? 'prod/images/default.jpg'}
                alt={comment.authorName}
                width={48}
                height={48}
                className='h-12 w-12 rounded-full bg-gray-300 object-cover'
              />
              <div className='flex w-[calc(100%-48px)] flex-col pl-2'>
                <div className='flex justify-between'>
                  <div className='flex'>
                    <h5 className='text-lg font-bold'>{comment.authorName}</h5>
                    <h5 className='ml-2 text-lg text-gray-500'>
                      @{comment.authorUsername}
                    </h5>
                  </div>
                  <p className='px-2 text-default-600'>
                    {editAndPostTimeCalculatorKO(
                      comment.createdTime,
                      comment.updatedTime
                    )}
                  </p>
                  {user &&
                    (user?.username === comment.authorUsername || isAdmin) && (
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
          </div>
        ))}
      </div>
    </div>
  );
}
