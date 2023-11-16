import { Metadata, ResolvingMetadata } from 'next';

import SinglePostItem from '@/app/(viewer)/post/[[...slug]]/SinglePostItem';
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
  searchParams,
}: {
  params: { slug: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const data = await fetchPost(params.slug[0]);
  if (!data) throw new Error('Failed to fetch data');
  return (
    <SinglePostItem
      feed={data}
      editMode={Boolean(searchParams?.edit) ?? false}
    />
  );
}
