import { Metadata, ResolvingMetadata } from 'next';

import jxios from '@/utils/jxios';

import { SingleEventType } from '@/types/event';

const fetchEvent = async (id: string) =>
  jxios
    .get('/api/exhibitions/' + id)
    .then((res) => res.data as SingleEventType);

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
  const data = await fetchEvent(id);
  // const thumbnail = (await parent).openGraph?.images || [];
  const previousImages = (await parent).openGraph?.images || [];
  return {
    title: `${data.title
      .replace(/<[^>]*>?/g, '')
      .slice(0, 20)} - ${'Artscope'}`,
    description: data.description.replace(/<[^>]*>?/g, ''),
    openGraph: {
      title: `${data.title.slice(0, 20)} - ${data.author} | Artscope`,
      description: data.description.replace(/<[^>]*>?/g, '').slice(0, 100),
      url: 'https://www.artscope.kr/event/' + id,
      type: 'article',
      authors: [data.author],
      images: [...previousImages],
    },
    publisher: data.author,
  };
}
export default async function Event(
  {
    params,
  }: {
    params: { slug: string[] };
  },
  // eslint-disable-next-line
  parent: ResolvingMetadata
) {
  const id = params.slug[0];
  // eslint-disable-next-line
  const data = await fetchEvent(id);

  return <></>;
}
