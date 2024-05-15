'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import CommentForm from '@/app/(main)/(viewer)/article/[id]/CommentForm';
import { CommentInputs } from '@/app/(main)/(viewer)/article/[id]/commentSchema';
import CommentView from '@/app/(main)/(viewer)/article/[id]/CommentView';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { CommentType } from '@/types/comment';

type Props = {
  id: number;
  comments: CommentType[];
};

export default function ArticleViewerComment(props: Props) {
  const { user, isLogin } = useUser();
  const router = useRouter();
  const [newReply, setNewReply] = useState<number>(0);

  const onNewCommentSubmit = (data: CommentInputs) =>
    jxios.post(`/api/magazines/${props.id}/comments`, data).then((res) => {
      if (res.status === 201) {
        router.refresh();
        setNewReply(0);
      }
    });

  const onNewReplySubmit = (data: CommentInputs) =>
    jxios
      .post(`/api/magazines/${props.id}/comments`, {
        comment: data.comment,
        parentCommentId: newReply,
      })
      .then((res) => {
        if (res.status === 201) {
          router.refresh();
          setNewReply(0);
        }
      });

  const handleDeleteComment = (id: number) =>
    confirm('정말 삭제하시겠습니까?') &&
    jxios.delete(`/api/magazines/${props.id}/comments/${id}`).then((res) => {
      if (res.status === 200) {
        router.refresh();
      }
    });
  return (
    <div className='flex flex-col gap-4 items-start justify-end p-6'>
      <p className='text-2xl'>댓글</p>
      <div className='gap-2.5 flex flex-col w-full'>
        {user ? (
          <CommentForm
            onSubmit={onNewCommentSubmit}
            authorName={user.name}
            authorProfileUrl={user.picture}
          />
        ) : (
          <Link
            href='/user/login'
            className='hover:underline underline-offset-4'>
            로그인 후 댓글을 작성할 수 있습니다.
          </Link>
        )}
        <CommentView
          comments={props.comments}
          replyComment={newReply}
          setReplyComment={setNewReply}
          authorName={user?.name}
          authorProfileUrl={user?.picture}
          onSubmit={onNewReplySubmit}
          onDelete={handleDeleteComment}
          isLogin={isLogin}
        />
      </div>
    </div>
  );
}
