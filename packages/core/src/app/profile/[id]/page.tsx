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
  const historyArray = profile.history?.split('\n\n');
  return (
    <div className='py-3'>
      <div className='container max-w-screen-md px-2.5 flex flex-col items-stretch gap-2 text-[#1A1A1A]'>
        <ProfileComponent
          clickable={false}
          username={profile.username}
          name={profile.name}
          picture={profile.picture}
          borderBottom
        />
        {profile.introduction && (
          <div className='border-[#DFA36D] p-6 text-xl border-b-4'>
            {standardLabel(profile.introduction)}
          </div>
        )}
        {historyArray && (
          <div className='text-xl py-4'>
            {historyArray.map((history, index) => (
              <>
                {history.split('\n').map((line, index) => (
                  <p key={index} className='px-6 py-1'>
                    {standardLabel(line)}
                  </p>
                ))}
                <div
                  key={index + 'border'}
                  className='h-1 w-full bg-[#DFA36D] my-1'></div>
              </>
            ))}
          </div>
        )}
      </div>
      <MembersArticleList username={profile.username} />
    </div>
  );
}
