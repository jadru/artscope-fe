import { Metadata, ResolvingMetadata } from 'next';

import MarkdownVewer from '@/components/MarkdownViewer';

import PostComment from '@/app/(viewer)/post/[[...slug]]/comment';
import SinglePostItemAction from '@/app/(viewer)/post/[[...slug]]/SinglePostItemAction';
import SinglePostMedia from '@/app/(viewer)/post/[[...slug]]/SinglePostMedia';
import SinglePostOpengraph from '@/app/(viewer)/post/[[...slug]]/SinglePostOpengraph';
import SinglePostProfile from '@/app/(viewer)/post/[[...slug]]/SinglePostProfile';
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
    title: `${data.content.replace(/<[^>]*>?/g, '').slice(0, 20)} - ${
      data.authorName
    }`,
    description: data.content.replace(/<[^>]*>?/g, ''),
    openGraph: {
      title: `${data.content.slice(0, 20)} - ${data.authorName} | Artscope`,
      description: data.content.replace(/<[^>]*>?/g, '').slice(0, 100),
      url: 'https://www.artscope.kr/artwork/' + id,
      type: 'article',
      authors: [data.authorName],
      images: [...previousImages],
    },
    publisher: data.authorName,
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
  const data = await fetchPost(params.slug[0]);
  if (!data) throw new Error('Failed to fetch data');
  return (
    <>
      <div className='border-default-200 bg-white pb-2 transition-colors md:mx-0'>
        <div className='flex w-full flex-col justify-between text-left md:flex-row'>
          <div className='w-full'>
            <SinglePostProfile feed={data} />

            <div className='flex flex-col justify-start px-1.5'>
              <div className='flex w-full flex-col gap-1 break-keep p-3 text-xl leading-relaxed tracking-wide'>
                <MarkdownVewer content={data.content} />
                <SinglePostOpengraph content={data.content} />
              </div>
            </div>
            {data.medias && data.medias.length > 1 && (
              <SinglePostMedia feed={data} />
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
          </div>
        </div>
        <SinglePostItemAction feed={data} />
      </div>
      <PostComment post={data} />
    </>
  );
}
