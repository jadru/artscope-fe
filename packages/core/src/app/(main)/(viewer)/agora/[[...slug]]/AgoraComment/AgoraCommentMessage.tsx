import Link from 'next/link';

import { editAndPostTimeCalculatorKO } from '@/utils/timeCalculator';

import { AgoraOpinionType } from '@/types/agora';

export default function AgoraCommentMessage({
  comment,
  voteStatus,
}: {
  comment: AgoraOpinionType;
  voteStatus: 'agree' | 'natural' | 'disagree';
}) {
  return (
    <div className='bg-default-100 rounded-xl p-2'>
      <div className='flex justify-between'>
        {comment.author.name.startsWith('익명') ? (
          <p className='text-default-700 font-bold'>
            {comment.author.name === '익명 작성자'
              ? '작성자'
              : comment.author.name}
          </p>
        ) : (
          <Link
            href={`/profile/${comment.author.username}`}
            className='text-default-700 font-bold hover:underline'>
            {comment.author.name}{' '}
            {comment.author.username ? '@' + comment.author.username : ''}
          </Link>
        )}

        <div
          className={`${
            voteStatus === 'disagree'
              ? 'bg-red-600'
              : voteStatus === 'agree'
              ? 'bg-blue-500'
              : 'bg-yellow-400'
          } rounded-2xl px-3 py-1 text-sm font-bold text-white`}>
          {comment.vote}
        </div>
      </div>
      <p>{comment.content}</p>
      <p className='text-default-600 mt-0.5 text-sm'>
        {editAndPostTimeCalculatorKO(comment.createdTime, comment.updatedTime)}
      </p>
    </div>
  );
}
