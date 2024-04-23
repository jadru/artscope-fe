import Link from 'next/link';

import { standardLabel } from '@/components/StandardLabel';

import CommentForm from '@/app/(main)/(viewer)/article/[id]/CommentForm';
import { CommentInputs } from '@/app/(main)/(viewer)/article/[id]/commentSchema';
import { timeCalculatorKO } from '@/utils/timeCalculator';

import { CommentType } from '@/types/comment';

type Props = {
  comments: CommentType[];
  replyComment: number;
  setReplyComment: (id: number) => void;
  authorName?: string;
  authorProfileUrl?: string;
  onSubmit: (data: CommentInputs) => void;
  isLogin?: boolean;
};

export default function CommentView(props: Props) {
  return (
    <div className='gap-2 flex flex-col w-full'>
      {props.comments.map((comment) => (
        <div
          key={comment.id}
          className='border-l pl-2.5 py-1 flex flex-col gap-1 w-full'>
          <Link href={'/profile/' + comment.author.authorUsername}>
            <p className='text-gray-700 text-sm hover:underline cursor-pointer'>
              {standardLabel(comment.author.authorName)}
            </p>
          </Link>
          <p className='font-normal'>
            <span className='font-bold pr-1'>
              {standardLabel(
                comment.mentionUsername ? '@' + comment.mentionUsername : ''
              )}
            </span>
            {standardLabel(comment.comment)}
          </p>
          <div className='flex justify-between'>
            {props.isLogin && (
              <p
                className='text-gray-600 text-sm hover:underline cursor-pointer font-bold'
                onClick={() =>
                  props.replyComment !== comment.id
                    ? props.setReplyComment(comment.id)
                    : props.setReplyComment(0)
                }>
                {props.replyComment !== comment.id ? '댓글' : '취소'}
              </p>
            )}
            <p className='text-gray-600 text-sm'>
              {timeCalculatorKO(
                new Date(comment.updatedTime) ?? new Date(comment.createdTime)
              )}
            </p>
          </div>
          <div>
            {props.replyComment === comment.id && (
              <CommentForm
                onSubmit={props.onSubmit}
                authorName={props.authorName}
                authorProfileUrl={props.authorProfileUrl}
              />
            )}
          </div>
          <CommentView
            comments={comment.childComments}
            authorProfileUrl={props.authorProfileUrl}
            authorName={props.authorName}
            replyComment={props.replyComment}
            setReplyComment={props.setReplyComment}
            onSubmit={props.onSubmit}
            isLogin={props.isLogin}
          />
        </div>
      ))}
    </div>
  );
}
