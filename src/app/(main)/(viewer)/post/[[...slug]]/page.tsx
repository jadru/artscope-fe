import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';

import MarkdownViewer from '@/components/MarkdownViewer';
import MediaSlider from '@/components/MediaSlider';
import ProfileComponent from '@/components/Profile';
import { standardLabel } from '@/components/StandardLabel';

import PostComment from '@/app/(main)/(viewer)/post/[[...slug]]/comment';
import SinglePostItemAction from '@/app/(main)/(viewer)/post/[[...slug]]/SinglePostItemAction';
import SinglePostOpengraph from '@/app/(main)/(viewer)/post/[[...slug]]/SinglePostOpengraph';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { SinglePostType } from '@/types/feed';

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
  const data: SinglePostType = await fetchPost(id);
  // const thumbnail = (await parent).openGraph?.images || [];
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `${standardLabel(data.content).slice(0, 20)} - ${standardLabel(
      data.authorName
    )}`,
    description: standardLabel(data.content),
    openGraph: {
      title: `${standardLabel(data.content).slice(0, 20)} - ${standardLabel(
        data.authorName
      )} | Artscope`,
      description: standardLabel(data.content).slice(0, 100),
      url: 'https://www.artscope.kr/artwork/' + id,
      type: 'article',
      authors: [data.authorName],
      images: [...previousImages],
    },
    publisher: 'Artscope',
  };
}

const fetchPost = async (id: string) =>
  jxios
    .get(NEXT_PUBLIC_API_URL + '/api/posts/' + id, {
      withCredentials: true,
    })
    .then((res) => res.data as SinglePostType);

export default async function SinglePost({
  params,
}: {
  params: { slug: string[] };
}) {
  if (!params.slug) redirect('/');
  const data = await fetchPost(params.slug[0]);
  if (!data) throw new Error('Failed to fetch data');
  return (
    <>
      <div className='space-y-3 px-3 py-3 md:px-0'>
        <ProfileComponent
          username={data.authorUsername}
          name={data.authorName}
          picture={data.authorProfileImageUrl}
        />
        <div className='w-full space-y-2 rounded-xl bg-default-100 px-3 py-3'>
          <MarkdownViewer>{data.content}</MarkdownViewer>
          <SinglePostOpengraph content={standardLabel(data.content)} />
        </div>
        {data.medias && data.medias.length > 1 && (
          <MediaSlider medias={data.medias.slice(1)} />
        )}
        {data.updatedTime ? (
          <p className='mx-1.5 mt-1.5 text-right text-default-500'>
            {new Date(data.updatedTime).toLocaleString('ko-KR', {
              dateStyle: 'full',
              timeStyle: 'short',
            }) + ' 수정'}
          </p>
        ) : (
          <p className='mx-1.5 mt-1.5 text-right text-default-500'>
            {new Date(data.createdTime).toLocaleString('ko-KR', {
              dateStyle: 'full',
              timeStyle: 'short',
            }) + ' 작성'}
          </p>
        )}

        <SinglePostItemAction feed={data} />
        <PostComment post={data} />
      </div>
    </>
  );
}
