import { redirect } from 'next/navigation';

import SinglePostItem from '@/app/post/[[...slug]]/SinglePostItem';
import { NEXT_PUBLIC_API_URL } from '@/constant/env';

import { SinglePostType } from '@/types';

const fetchPost = async (id: string) =>
  await fetch(NEXT_PUBLIC_API_URL + '/api/posts/' + id).then((res) =>
    res.json()
  );

export default async function SinglePost({
  params,
  searchParams,
}: {
  params: { slug: string[] };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const data: SinglePostType = await fetchPost(params.slug[0]);
  if (data.parentPostId)
    redirect(
      `/post/${data.parentPostId}${
        searchParams?.edit ? '?edit=' + searchParams?.edit : ''
      }`
    );

  return (
    <div>
      <SinglePostItem
        feed={data}
        editMode={Boolean(searchParams?.edit) ?? false}
      />
    </div>
  );
}
