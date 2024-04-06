'use client';

import CommentForm from '@/app/(main)/(viewer)/article/[id]/CommentForm';
import { CommentInputs } from '@/app/(main)/(viewer)/article/[id]/commentSchema';
import ParentComment from '@/app/(main)/(viewer)/article/[id]/ParentComment';
import { useUser } from '@/states';
import jxios from '@/utils/jxios';

export default function ArticleViewerComment(props: { id: number }) {
  const { user, isLogin } = useUser();

  const onSubmit = async (data: CommentInputs) =>
    await jxios.post(`/api/magazines/${data.id}/comments`, data);

  return (
    <div className='flex flex-col gap-4 items-start justify-end p-6'>
      <p className='text-2xl'>댓글</p>
      <CommentForm
        onSubmit={onSubmit}
        id={props.id}
        authorName={user?.name}
        authorProfileUrl={user?.picture}
      />
      <ParentComment />
    </div>
  );
}
