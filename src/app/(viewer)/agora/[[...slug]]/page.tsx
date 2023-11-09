import React from 'react';

import MarkdownVewer from '@/components/MarkdownViewer';

import AgoraAction from '@/app/(viewer)/agora/[[...slug]]/AgoraAction';
import AgoraChart from '@/app/(viewer)/agora/[[...slug]]/AgoraChart';
import AgoraProfile from '@/app/(viewer)/agora/[[...slug]]/AgoraProfile';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { AgoraDetailType } from '@/types/agora';

const fetchAgoraDetail = async (slug: string) =>
  jxios
    .get(`${NEXT_PUBLIC_API_URL}/api/agoras/${slug}`)
    .then((res) => res.data as AgoraDetailType);

export default async function AgoraDetailPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const data = await fetchAgoraDetail(params.slug[0]);
  return (
    <div>
      <h1 className='break-words px-3 pt-2 text-center font-serif text-4xl'>
        {data.agora.title}
      </h1>
      {data.agora.isAnonymous ? (
        <h4 className='px-3 py-2 text-center'>
          익명의 사용자가 작성한 글입니다.
        </h4>
      ) : (
        <AgoraProfile agora={data} />
      )}
      <div className='flex h-96 w-full justify-center'>
        <AgoraChart agora={data} />
      </div>
      <hr />
      <div className='px-3 py-3 md:px-3'>
        <MarkdownVewer content={data.agora.content} />
      </div>
      <div className='px-2 pb-2'>
        {data.agora.updatedTime && (
          <p>
            {new Date(data.agora.updatedTime).toLocaleString('ko-KR')} 편집됨
          </p>
        )}
        <p>{new Date(data.agora.createdTime).toLocaleString('ko-KR')} 작성됨</p>
      </div>
      <AgoraAction data={data} />
    </div>
  );
}
