'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BiCircle, BiQuestionMark, BiX } from 'react-icons/bi';
import { toast } from 'react-toastify';

import { useUser } from '@/states';
import jxios from '@/utils/jxios';

import { AgoraDetailType } from '@/types/agora';

export default function AgoraAction({ data }: { data: AgoraDetailType }) {
  const [button, setButton] = useState<
    'agree' | 'disagree' | 'natural' | undefined
  >();
  const { isLogin } = useUser();
  const [agreeCount, setAgreeCount] = useState<number>(data.agora.agreeCount);
  const [disagreeCount, setDisagreeCount] = useState<number>(
    data.agora.disagreeCount
  );
  const [naturalCount, setNaturalCount] = useState<number>(
    data.agora.naturalCount
  );
  const [modal, setModal] = useState<boolean>(false);
  const [opinion, setOpinion] = useState<string>('');
  const { push } = useRouter();

  useEffect(() => {
    if (data.agora.userVoteStatus === data.agora.agreeText) setButton('agree');
    else if (data.agora.userVoteStatus === data.agora.disagreeText)
      setButton('disagree');
    else if (data.agora.userVoteStatus === data.agora.naturalText)
      setButton('natural');
  }, [data]);

  const handleVote = async (status: 'agree' | 'disagree' | 'natural') => {
    setButton(status);
    let statusText = '';
    if (status === 'agree') {
      setAgreeCount(agreeCount + 1);
      statusText = data.agora.agreeText;
    } else if (status === 'disagree') {
      setDisagreeCount(disagreeCount + 1);
      statusText = data.agora.disagreeText;
    } else if (status === 'natural') {
      setNaturalCount(naturalCount + 1);
      statusText = data.agora.naturalText;
    }
    jxios
      .post('/api/agoras/' + data.agora.id + '/vote', statusText, {
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      .then((res) => {
        if (res.status === 200) setModal(true);
        else if (res.status === 204) unVoteCount(status);
      });
  };

  const handleUnvote = async (status: 'agree' | 'disagree' | 'natural') => {
    unVoteCount(status);
    let statusText = '';
    if (status === 'agree') {
      statusText = data.agora.agreeText;
    } else if (status === 'disagree') {
      statusText = data.agora.disagreeText;
    } else if (status === 'natural') {
      statusText = data.agora.naturalText;
    }
    jxios
      .post('/api/agoras/' + data.agora.id + '/vote', statusText, {
        headers: {
          'Content-Type': 'text/plain',
        },
      })
      .then((res) => {
        if (res.status === 200) setModal(true);
        else if (res.status === 204) unVoteCount(status);
      });
  };

  const unVoteCount = (status: 'agree' | 'disagree' | 'natural') => {
    setButton(undefined);
    if (status === 'agree') {
      setAgreeCount(agreeCount - 1);
    } else if (status === 'disagree') {
      setDisagreeCount(disagreeCount - 1);
    } else if (status === 'natural') {
      setNaturalCount(naturalCount - 1);
    }
  };

  const handleSetOpinion = async () => {
    setModal(false);
    jxios
      .post('/api/agoras/' + data.agora.id + '/opinions', {
        content: opinion,
      })
      .then((res) => {
        if (res.status === 200) {
          toast('의견이 등록되었습니다.');
          setOpinion('');
          push('/agora/' + data.agora.id);
        }
      });
  };

  return isLogin ? (
    <>
      <div className='mx-1 mt-1 grid grid-cols-3 gap-1 md:gap-2'>
        <button
          className={`${
            button === 'disagree' || button === undefined
              ? 'bg-red-600'
              : 'bg-default-500'
          } flex h-16 w-full items-center justify-center gap-1 rounded-2xl font-bold text-white transition hover:opacity-90`}
          onClick={() => {
            if (button === 'disagree') {
              if (confirm('의견을 취소하시나요?')) {
                handleUnvote('disagree');
              }
            } else {
              handleVote('disagree');
            }
          }}
          disabled={button !== undefined && button !== 'disagree'}
        >
          <BiX size={30} />
          <p>
            {data.agora.disagreeText} {disagreeCount}
          </p>
        </button>
        <button
          className={`${
            button === 'natural' || button === undefined
              ? 'bg-yellow-400'
              : 'bg-default-500'
          } flex h-16 w-full items-center justify-center gap-1 rounded-2xl font-bold text-white transition hover:opacity-90`}
          onClick={() => {
            if (button === 'natural') {
              if (confirm('의견을 취소하시나요?')) {
                handleUnvote('natural');
              }
            } else {
              handleVote('natural');
            }
          }}
          disabled={button !== undefined && button !== 'natural'}
        >
          <BiQuestionMark size={23} />
          <p>
            {data.agora.naturalText} {naturalCount}
          </p>
        </button>
        <button
          className={`${
            button === 'agree' || button === undefined
              ? 'bg-blue-600'
              : 'bg-default-500'
          } flex h-16 w-full items-center justify-center gap-1 rounded-2xl font-bold text-white transition hover:opacity-90`}
          onClick={() => {
            if (button === 'agree') {
              if (confirm('의견을 취소하시나요?')) {
                handleUnvote('agree');
              }
            } else {
              handleVote('agree');
            }
          }}
          disabled={button !== undefined && button !== 'agree'}
        >
          <BiCircle size={23} />
          <p>
            {data.agora.agreeText} {agreeCount}
          </p>
        </button>
      </div>
      {modal && (
        <div
          className='fixed left-0 top-0 z-[51] mx-auto flex h-screen w-screen items-center justify-center bg-black/50'
          onClick={() => setModal(false)}
        >
          <div
            className='h-screen w-screen rounded-3xl bg-white md:h-[400px] md:w-[500px]'
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex h-[calc(100vh-70px)] w-screen flex-col justify-center gap-3 p-4 md:h-[400px] md:w-[500px]'>
              <textarea
                id='opinion'
                className='h-full w-full resize-none rounded-2xl border p-3'
                placeholder={
                  (button === 'agree'
                    ? data.agora.agreeText
                    : button === 'natural'
                    ? data.agora.naturalText
                    : data.agora.disagreeText) +
                  '에 대한 \n추가 의견을 입력하세요.'
                }
                value={opinion}
                onChange={(e) => setOpinion(e.target.value)}
              />
              <Button color='primary' onClick={handleSetOpinion}>
                추가 의견 등록
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <Link href='/user/login' className='w-full px-2'>
      <button className='my-2 h-16 w-[calc(100%-1rem)] rounded-2xl border border-black bg-indigo-200 transition hover:bg-amber-100'>
        <p>
          <b className='font-bold text-black '>
            의견을 남기려면 로그인이 필요합니다.
          </b>
        </p>
      </button>
    </Link>
  );
}
