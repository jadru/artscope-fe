import ProfileComponent from '@/components/Profile';
import { standardLabel } from '@/components/StandardLabel';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { profileApiType } from '@/types/profile';

const fetchProfile = async (id: string) => {
  return await jxios
    .get(`${NEXT_PUBLIC_API_URL}/api/members/${id}`)
    .then((res) => res.data as profileApiType);
};

export default async function ProfileDetail({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const profile = await fetchProfile(params.id);
  const historyArray = profile.history?.split('\n');
  return (
    <div className='container max-w-screen-md px-2.5 flex flex-col items-stretch gap-2'>
      <ProfileComponent
        clickable={false}
        username={profile.username}
        name={profile.name}
        picture={profile.picture}
      />
      {profile.introduction && (
        <div className='bg-[rgb(202,87,58)] p-6 text-xl text-white'>
          {standardLabel(profile.introduction)}
        </div>
      )}
      {historyArray && (
        <div className='bg-black p-6 text-xl text-white'>
          {historyArray.map((history, index) => (
            <p key={index}>{standardLabel(history)}</p>
          ))}
        </div>
      )}
    </div>
  );
}
