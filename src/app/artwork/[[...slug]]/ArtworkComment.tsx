'use client';

import { Button, Input } from '@nextui-org/react';
import { useDebounce } from '@toss/react';
import React, { ChangeEvent, useState } from 'react';

import ASNextImage from '@/components/ASNextImage';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';
import { timeCaculatortoKO } from '@/utils/timeCalculator';

import { ArtworkType } from '@/types/artwork';

export default function ArtworkComment({ aw: awData }: { aw: ArtworkType }) {
  const [aw, setAwData] = useState<ArtworkType>(awData);
  const { user, isLogin } = useUser();
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
    <div className='space-y-2 border-t px-2 py-4 md:border'>
      <h4 className='px-2 text-3xl'>
        댓글 {aw.artwork.artworkComments.length}
      </h4>
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
        {aw.artwork.artworkComments.map((comment, index) => (
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
                  <h5 className='ml-2 text-gray-500'>
                    {timeCaculatortoKO(comment.updatedTime) ??
                      timeCaculatortoKO(comment.createdTime)}
                  </h5>
                  {user?.username === comment.authorUsername && (
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
            {index + 1 !== aw.artwork.artworkComments.length && (
              <hr key={comment.id + '-divider'} />
            )}
          </>
        ))}
      </div>
    </div>
  );
}
