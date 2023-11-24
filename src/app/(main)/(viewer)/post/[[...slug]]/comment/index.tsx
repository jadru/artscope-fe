'use client';

import { Button, Input } from '@nextui-org/react';
import { useDebounce } from '@toss/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import ASNextImage from '@/components/ASNextImage';
import LoginNeeded from '@/components/LoginNeeded';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';
import { editAndPostShortCalculatorKO } from '@/utils/timeCalculator';

import { SinglePostType } from '@/types/feed';

export default function Index({ post: PostData }: { post: SinglePostType }) {
  const [post, setPostData] = useState<SinglePostType>(PostData);
  const [toComment, setTocomment] = useState<number | undefined>();
  const [reCommentContent, setReCommentContent] = useState<string>('');
  const [commentCount, setCommentCount] = useState<number>(post.comments);
  const { user, isLogin, isAdmin } = useUser();
  const { push } = useRouter();
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    setReCommentContent('');
  }, [toComment]);

  const submitComment = useDebounce(
    () =>
      content !== '' &&
      jxios.post(`/api/posts/${post.id}/comments`, { content }).then((res) => {
        setContent('');
        const newPostData = res.data as SinglePostType;
        if (newPostData.id === PostData.id) setPostData(newPostData);
        else
          setPostData((prev) => {
            return {
              ...prev,
              commentPosts: prev.commentPosts.map((comment) => {
                return comment;
              }),
            };
          });
        setTocomment(PostData.id);
        setCommentCount((prev) => prev + 1);
      }),
    300
  );

  const submitRecomment = useDebounce(
    () =>
      reCommentContent !== '' &&
      jxios
        .post(`/api/posts/${post.id}/comments`, {
          content: reCommentContent,
          parentCommentId: toComment,
        })
        .then((res) => {
          setPostData((prev) => {
            return {
              ...prev,
              commentPosts: res.data.commentPosts,
            };
          });
          setReCommentContent('');
          setTocomment(undefined);
          setCommentCount((prev) => prev + 1);
        }),
    300
  );

  const handleCommentDelete = (id: number) => {
    if (confirm('댓글을 정말 삭제하시겠습니까?'))
      jxios.delete(`/api/posts/comments/${id}`).then((res) => {
        if (res.status === 200)
          setPostData({
            ...post,
            commentPosts: post.commentPosts.map((comment) => {
              return comment.id === id
                ? {
                    ...comment,
                    content: '삭제된 댓글입니다.',
                  }
                : {
                    ...comment,
                    childComments: comment.childComments.filter(
                      (reComment) => reComment.id !== id
                    ),
                  };
            }),
          });
      });
  };

  return (
    <div className='flex flex-col items-stretch gap-2 rounded-xl border-2 px-2 py-2'>
      <h3 className='font-normal'>댓글 {commentCount}</h3>
      {isLogin && (
        <div className='flex px-2'>
          <Input
            placeholder='댓글을 입력하세요'
            variant='bordered'
            value={content}
            onValueChange={setContent}
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
      <LoginNeeded href='/user/login' />
      <div className='flex flex-col items-stretch gap-1'>
        {isLogin && post.comments === 0 && (
          <p className='p-4 text-center'>첫 댓글을 작성해보세요</p>
        )}
        {post.commentPosts.map((comment) => (
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
                <div className='flex'>
                  <h5 className='text-lg font-bold'>{comment.authorName}</h5>
                  <p className='px-2 text-default-600'>
                    {editAndPostShortCalculatorKO(
                      comment.createdTime,
                      comment.updatedTime
                    )}
                  </p>

                  <h5
                    className='ml-2 cursor-pointer font-bold text-gray-500 hover:underline'
                    onClick={() => {
                      if (!isLogin) push('/user/login');
                      if (toComment === comment.id) {
                        setTocomment(undefined);
                        return;
                      }
                      setTocomment(comment.id);
                    }}
                  >
                    댓글
                  </h5>

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
            {comment.childComments && comment.childComments.length > 0 && (
              <div className='mt-1 flex flex-col gap-1 pl-6'>
                {comment.childComments.map((reComment) => (
                  <div key={reComment.id} className='rounded-xl bg-default-100'>
                    <div className='flex px-2 py-3'>
                      <ASNextImage
                        src={
                          reComment.authorProfileImageUrl ??
                          'prod/images/default.jpg'
                        }
                        alt={reComment.authorName}
                        width={48}
                        height={48}
                        className='h-12 w-12 rounded-full bg-gray-300 object-cover'
                      />
                      <div className='flex w-[calc(100%-48px)] flex-col pl-2'>
                        <div className='flex'>
                          <h5 className='text-lg font-bold'>
                            {reComment.authorName}
                          </h5>
                          <p className='px-2 text-default-600'>
                            {editAndPostShortCalculatorKO(
                              comment.createdTime,
                              comment.updatedTime
                            )}
                          </p>
                          <h5
                            className='ml-2 cursor-pointer font-bold text-gray-500 hover:underline'
                            onClick={() => {
                              isLogin
                                ? setTocomment(reComment.id)
                                : push('/user/login');
                            }}
                          >
                            댓글
                          </h5>
                          {user &&
                            (user?.username === reComment.authorUsername ||
                              isAdmin) && (
                              <h5
                                className='ml-2 cursor-pointer text-lg font-bold text-gray-500 hover:underline'
                                onClick={() =>
                                  handleCommentDelete(reComment.id)
                                }
                              >
                                삭제
                              </h5>
                            )}
                        </div>
                        <p className='break-words'>
                          <span
                            className='cursor-pointer font-bold text-blue-500 hover:underline'
                            onClick={() =>
                              push('/profile/' + reComment.authorUsername)
                            }
                          >
                            {reComment.mentionUsername
                              ? '@' + reComment.mentionUsername + '  '
                              : ''}
                          </span>
                          {reComment.content}
                        </p>
                      </div>
                    </div>
                    {isLogin && toComment && toComment === reComment?.id && (
                      <div className='flex px-2 py-1.5'>
                        <Input
                          placeholder='댓글을 입력하세요'
                          autoFocus
                          variant='bordered'
                          value={reCommentContent}
                          onValueChange={setReCommentContent}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              submitRecomment();
                            }
                          }}
                          size='lg'
                        />
                        <Button
                          className='ml-2'
                          color='primary'
                          size='lg'
                          onClick={submitRecomment}
                        >
                          작성
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {isLogin && toComment && toComment === comment.id && (
              <div className='flex px-2 py-1.5'>
                <Input
                  placeholder='댓글을 입력하세요'
                  autoFocus
                  variant='bordered'
                  value={reCommentContent}
                  onValueChange={setReCommentContent}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      submitRecomment();
                    }
                  }}
                  size='lg'
                />
                <Button
                  className='ml-2'
                  color='primary'
                  size='lg'
                  onClick={submitRecomment}
                >
                  작성
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
