import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react';

import LoginNeeded from '@/components/LoginNeeded';
import MarkdownViewer from '@/components/MarkdownViewer';
import MediaSlider from '@/components/MediaSlider';
import StandardLabel, { standardLabel } from '@/components/StandardLabel';

import AgoraAction from '@/app/(main)/(viewer)/agora/[[...slug]]/AgoraAction';
import AgoraChart from '@/app/(main)/(viewer)/agora/[[...slug]]/AgoraChart';
import AgoraComments from '@/app/(main)/(viewer)/agora/[[...slug]]/AgoraComment';
import AgoraProfile from '@/app/(main)/(viewer)/agora/[[...slug]]/AgoraProfile';
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
  if (!params.slug) redirect('/agoras');
  const id = params.slug[0];
  const data = await fetchAgoraDetail(id);
  if (!data) throw new Error('Failed to fetch data');
  // const thumbnail = (await parent).openGraph?.images || [];
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `${standardLabel(data.agora.title)
      .replace(/<[^>]*>?/g, '')
      .slice(0, 20)} 아고라`,
    description: standardLabel(data.agora.content),
    openGraph: {
      title: `${standardLabel(data.agora.title).slice(0, 20)} | Artscope`,
      description: standardLabel(data.agora.content).slice(0, 100),
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
  if (!params.slug) redirect('/agoras');
  const data = await fetchAgoraDetail(params.slug[0]);
  if (!data) throw new Error('Failed to fetch data');
  return (
    <div className='flex flex-col items-stretch gap-3 px-3 py-3 md:px-0'>
      <h1 className='break-keep text-[2.3rem] font-normal'>
        <StandardLabel label={data.agora.title} />
      </h1>
      <h2 className='text-center'>{data.agora.participantCount}명 참여</h2>
      {data.agora.isAnonymous ? (
        <h4 className='px-3 text-center'>익명의 사용자가 작성한 글입니다.</h4>
      ) : (
        <AgoraProfile agora={data} />
      )}
      <AgoraChart agora={data} />
      <div className='w-full rounded-xl bg-default-100 px-3 py-3'>
        <MarkdownViewer>{data.agora.content}</MarkdownViewer>
      </div>
      {data.agora.medias && data.agora.medias.length > 1 && (
        <MediaSlider medias={data.agora.medias.slice(1)} />
      )}
      <div className='px-1.5 text-right text-default-500'>
        {data.agora.updatedTime && (
          <p>
            {new Date(data.agora.updatedTime).toLocaleString('ko-KR')} 편집됨
          </p>
        )}
        <p>{new Date(data.agora.createdTime).toLocaleString('ko-KR')} 작성됨</p>
      </div>

      <AgoraAction data={data} />
      <LoginNeeded href='/user/login' />
      <AgoraComments data={data} />
    </div>
  );
}
