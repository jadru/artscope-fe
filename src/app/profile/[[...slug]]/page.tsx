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
  return (
    <div className='text-md w-full bg-orange-50 py-4 font-serif'>
      <h1 className='text-md text-center font-light '>{data.name}</h1>
      <h3 className='text-4xl font-semibold'>{data.introduction}</h3>
      {data.history}
    </div>
  );
}
