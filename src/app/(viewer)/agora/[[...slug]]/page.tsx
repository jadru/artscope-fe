import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';

import ASNextImage from '@/components/ASNextImage';
import MarkdownViewer from '@/components/MarkdownViewer';

import AgoraAction from '@/app/(viewer)/agora/[[...slug]]/AgoraAction';
import AgoraChart from '@/app/(viewer)/agora/[[...slug]]/AgoraChart';
import AgoraComments from '@/app/(viewer)/agora/[[...slug]]/AgoraComment';
import AgoraMedia from '@/app/(viewer)/agora/[[...slug]]/AgoraMedia';
import AgoraProfile from '@/app/(viewer)/agora/[[...slug]]/AgoraProfile';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { AgoraDetailType } from '@/types/agora';

const fetchAgoraDetail = async (slug: string) =>
  jxios
    .get(`${NEXT_PUBLIC_API_URL}/api/agoras/${slug}`)
    .then((res) => res.data as AgoraDetailType);

export async function generateMetadata(
  {
    params,
  }: {
    params: { slug: string[] };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.slug[0];
  const data = await fetchAgoraDetail(id);
  if (!data) throw new Error('Failed to fetch data');
  // const thumbnail = (await parent).openGraph?.images || [];
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `${data.agora.title
      .replace(/<[^>]*>?/g, '')
      .slice(0, 20)} 아고라 토론`,
    description: data.agora.content.replace(/<[^>]*>?/g, ''),
    openGraph: {
      title: `${data.agora.title.slice(0, 20)} 이벤트 | Artscope`,
      description: data.agora.content.replace(/<[^>]*>?/g, '').slice(0, 100),
      url: 'https://www.artscope.kr/agora/' + id,
      type: 'article',
      authors: ['Artscope'],
      images: [...previousImages],
    },
    publisher: 'Artscope',
  };
}

export default async function AgoraDetailPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const data = await fetchAgoraDetail(params.slug[0]);
  return (
    <div className='space-y-3 py-3'>
      <h1 className='break-words px-3 text-center text-4xl'>
        {data.agora.title}
      </h1>
      <h2 className='text-center'>{data.agora.participantCount}명 참여</h2>
      {data.agora.isAnonymous ? (
        <h4 className='px-3 text-center'>익명의 사용자가 작성한 글입니다.</h4>
      ) : (
        <AgoraProfile agora={data} />
      )}
      <div className='mt-3 flex w-full flex-col-reverse items-center justify-between gap-2 px-3 md:flex-row'>
        <AgoraChart agora={data} />
        {data.agora.thumbnail?.mediaUrl && <ASNextImage
          src={data.agora.thumbnail.mediaUrl}
          alt={data.agora.title}
          width={400}
          height={400}
          className='h-96 w-full rounded-xl object-cover md:w-1/2'
        />}
      </div>
      <div className='px-3 md:px-3'>
        <MarkdownViewer>{data.agora.content}</MarkdownViewer>
      </div>
      {data.agora.medias && data.agora.medias.length > 2 && <AgoraMedia feed={data} />}
      <div className='px-2'>
        {data.agora.updatedTime && (
          <p>
            {new Date(data.agora.updatedTime).toLocaleString('ko-KR')} 편집됨
          </p>
        )}
        <p>{new Date(data.agora.createdTime).toLocaleString('ko-KR')} 작성됨</p>
      </div>

      <AgoraAction data={data} />
      <AgoraComments data={data} />
    </div>
  );
}
