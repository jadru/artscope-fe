'use client';

import { Input, Kbd } from '@nextui-org/react';
import { useEffect, useState } from 'react';

import AgoraCommentMessage from '@/app/(viewer)/agora/[[...slug]]/AgoraComment/AgoraCommentMessage';
import { useUser } from '@/states';

import { AgoraDetailType, AgoraOpinionType } from '@/types/agora';

export default function Index({ data }: { data: AgoraDetailType }) {
  const [opinion, setOpinion] = useState<AgoraOpinionType[]>();
  const { isLogin } = useUser();
  useEffect(() => {
    setOpinion(
      [
        ...data.agreeOpinions,
        ...data.disagreeOpinions,
        ...data.naturalOpinions,
      ].sort((a, b) => {
        return (
          new Date(b.createdTime).getTime() - new Date(a.createdTime).getTime()
        );
      })
    );
  }, [data]);
  return (
    <div className='mx-2 my-2 space-y-1.5'>
      {isLogin && data.agora.userVoteStatus !== undefined && (
        <Input
          variant='bordered'
          type='text'
          placeholder={
            data.agora.userVoteStatus + '에 대한 추가 의견을 입력하세요'
          }
          endContent={<Kbd keys={['enter']}>Enter</Kbd>}
        />
      )}
      <div className='hidden grid-cols-3 gap-2 md:grid'>
        <div>
          {data.disagreeOpinions.map((comment) => (
            <AgoraCommentMessage
              comment={comment}
              voteStatus='disagree'
              key={comment.author.name + comment.createdTime}
            />
          ))}
        </div>
        <div>
          {data.naturalOpinions.map((comment) => (
            <AgoraCommentMessage
              comment={comment}
              voteStatus='natural'
              key={comment.author.name + comment.createdTime}
            />
          ))}
        </div>
        <div>
          {data.agreeOpinions.map((comment) => (
            <AgoraCommentMessage
              comment={comment}
              voteStatus='agree'
              key={comment.author.name + comment.createdTime}
            />
          ))}
        </div>
      </div>
      <div className='flex flex-col md:hidden'>
        {opinion &&
          opinion.map((comment) => (
            <AgoraCommentMessage
              comment={comment}
              voteStatus={
                comment.vote === data.agora.agreeText
                  ? 'agree'
                  : comment.vote === data.agora.disagreeText
                  ? 'disagree'
                  : 'natural'
              }
              key={comment.author.name + comment.createdTime}
            />
          ))}
      </div>
    </div>
  );
}
