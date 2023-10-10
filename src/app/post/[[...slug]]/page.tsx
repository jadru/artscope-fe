'use client';

import { useEffect, useState } from 'react';

import FeedListItem from '@/app/(feed)/FeedListItem';
import jxios from '@/utils/jxios';

import { feedItemType } from '@/types';

const fetchPost = async (id: string) =>
  jxios.get('/api/post/' + id).then((res) => res.data);

export default function SinglePost({ params }: { params: { slug: string[] } }) {
  const [data, setData] = useState<feedItemType | undefined>(undefined);
  useEffect(() => {
    fetchPost(params.slug[0]).then((res) => setData(res));
  }, [params.slug]);
  return data ? (
    <>
      <FeedListItem feed={data} isSinglePost={true} />
    </>
  ) : (
    ''
  );
}
