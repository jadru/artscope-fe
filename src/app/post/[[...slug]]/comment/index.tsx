import { Button, Input } from '@nextui-org/react';
import { useDebounce } from '@toss/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

import ASNextImage from '@/components/ASNextImage';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';
import { timeCaculatortoKO } from '@/utils/timeCalculator';

import { SinglePostType } from '@/types/feed';

export default function Index({ post: PostData }: { post: SinglePostType }) {
  const [post, setPostData] = useState<SinglePostType>(PostData);
  const [toComment, setTocomment] = useState<number | undefined>();
  const [reCommentContent, setReCommentContent] = useState<string>('');
  const { user, isLogin } = useUser();
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
              commentPosts: prev.commentPosts.map((comment) => {
                if (comment.id === toComment) {
                  return {
                    ...comment,
                    childComments: res.data.commentPosts,
                  };
                }
                return comment;
              }),
            };
          });
          setReCommentContent('');
          setTocomment(undefined);
        }),
    300
  );

  const handleCommentDelete = (id: number) => {
    if (confirm('댓글을 정말 삭제하시겠습니까?'))
      jxios.delete(`/api/comments/${id}`).then((res) => {
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
    <div className='space-y-2 border-t px-2 py-4 md:border'>
      <h4 className='px-2 text-3xl'>댓글 {post.commentPosts.length}</h4>
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
      <div>
        {post.commentPosts.map((comment) => (
          <div key={comment.id}>
            <div className='flex px-2 py-3 hover:bg-default-100'>
              <ASNextImage
                src={comment.authorProfileImageUrl ?? '/images/default.png'}
                alt={comment.authorName}
                width={48}
                height={48}
                className='h-12 w-12 rounded-full bg-gray-300 object-cover'
              />
              <div className='flex w-[calc(100%-48px)] flex-col pl-2'>
                <div className='flex'>
                  <h5 className='text-lg font-bold'>{comment.authorName}</h5>
                  <h5 className='ml-2 text-gray-500'>
                    {timeCaculatortoKO(comment.updatedTime) ??
                      timeCaculatortoKO(comment.createdTime)}
                  </h5>
                  {isLogin && (
                    <h5
                      className='ml-2 cursor-pointer font-bold text-gray-500 hover:underline'
                      onClick={() => {
                        if (toComment === comment.id) {
                          setTocomment(undefined);
                          return;
                        }
                        setTocomment(comment.id);
                      }}
                    >
                      댓글
                    </h5>
                  )}
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
            {comment.childComments && comment.childComments.length > 0 && (
              <div className='flex flex-col gap-2 pl-6'>
                {comment.childComments.map((reComment) => (
                  <div key={reComment.id} className='hover:bg-default-100'>
                    <div className='flex px-2 py-3'>
                      <ASNextImage
                        src={
                          reComment.authorProfileImageUrl ??
                          '/images/default.png'
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
                          <h5 className='ml-2 text-gray-500'>
                            {timeCaculatortoKO(reComment.updatedTime) ??
                              timeCaculatortoKO(reComment.createdTime)}
                          </h5>
                          <h5 className='ml-2 text-gray-500'>
                            좋아요 {reComment.likes}
                          </h5>
                          <h5
                            className='ml-2 cursor-pointer font-bold text-gray-500 hover:underline'
                            onClick={() => {
                              setTocomment(reComment.id);
                            }}
                          >
                            댓글
                          </h5>
                          {user?.username === reComment.authorUsername && (
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
                              push('/profile/' + reComment.authorUsername)
                            }
                          >
                            {reComment.mentionUsername
                              ? '@' + reComment.mentionUsername
                              : ''}
                          </span>
                          {reComment.content}
                        </p>
                      </div>
                    </div>
                    {reComment.id && (
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
            {toComment && toComment === comment.id && (
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
