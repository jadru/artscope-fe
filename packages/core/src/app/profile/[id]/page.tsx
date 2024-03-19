import ProfileComponent from '@/components/Profile';
import { standardLabel } from '@/components/StandardLabel';

import MembersArticleList from '@/app/profile/[id]/article-list';
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
    <>
      <div className='container max-w-screen-md px-2.5 flex flex-col items-stretch gap-2 py-3'>
        <ProfileComponent
          clickable={false}
          username={profile.username}
          name={profile.name}
          picture={profile.picture}
        />
        {profile.introduction && (
          <div className='bg-[#DFA36D] p-6 text-xl text-white'>
            {standardLabel(profile.introduction)}
          </div>
        )}
        {historyArray && (
          <div className='py-4 text-xl text-[#1A1A1A]'>
            {historyArray.map((history, index) => (
              <p key={index} className='border-b-2 border-[#1A1A1A] mb-3'>
                {standardLabel(history)}
              </p>
            ))}
          </div>
        )}
        <MembersArticleList username={profile.username} />
      </div>
    </>
  );
}
