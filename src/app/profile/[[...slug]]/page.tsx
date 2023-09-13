import { NEXT_PUBLIC_API_URL } from '@/constant/env';

import { profileApiType } from '@/types';

const fetchProfile = async (username: string) =>
  fetch(NEXT_PUBLIC_API_URL + '/api/members/' + username).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch data');
    }
    return res.json();
  });

export default async function ProfilePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const data: profileApiType = await fetchProfile(params.slug[0]);
  return <div>{data.username}</div>;
}
