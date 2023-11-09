import { format } from 'date-fns';
import { Metadata, ResolvingMetadata } from 'next';

import MarkdownVewer from '@/components/MarkdownViewer';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { EventDetailType } from '@/types/event';

const fetchEvent = async (id: string) =>
  jxios
    .get(NEXT_PUBLIC_API_URL + '/api/exhibitions/' + id)
    .then((res) => res.data as EventDetailType);

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
    title: `${data.exhibitionList.title
      .replace(/<[^>]*>?/g, '')
      .slice(0, 20)} 이벤트 정보`,
    description: data.exhibitionList.description.replace(/<[^>]*>?/g, ''),
    openGraph: {
      title: `${data.exhibitionList.title.slice(0, 20)} 이벤트 | Artscope`,
      description: data.exhibitionList.description
        .replace(/<[^>]*>?/g, '')
        .slice(0, 100),
      url: 'https://www.artscope.kr/event/' + id,
      type: 'article',
      authors: [data.exhibitionList.author],
      images: [...previousImages],
    },
    publisher: data.exhibitionList.author,
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
  if (!data) throw new Error('Failed to fetch data');

  return (
    <div>
      <div className='px-3 pb-2'>
        <h1>{data.exhibitionList.title}</h1>
        <h3>
          일정 -
          {format(
            new Date(data.exhibitionList.eventSchedule[0].eventDate),
            'yyyy년 MM월 dd일'
          )}{' '}
          {data.exhibitionList.eventSchedule[0].startTime} -
          {data.exhibitionList.eventSchedule[0].endTime}
        </h3>
        <h3>{data.location.name}</h3>
      </div>
      <hr />
      <div className='p-3'>
        <MarkdownVewer content={data.exhibitionList.description} />
      </div>
      <hr />
      <h2>{data.exhibitionList.eventType}</h2>
    </div>
  );
}
