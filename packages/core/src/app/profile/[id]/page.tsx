import { Metadata, ResolvingMetadata } from 'next';

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

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;

  if (!id) throw new Error('id is required');

  const profile = await fetchProfile(id);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${standardLabel(profile.name)} 작가 - Artscope`,
    description: standardLabel(profile.introduction).slice(0, 40),
    openGraph: {
      images: [profile.picture, ...previousImages],
      title: `${standardLabel(profile.name)} 작가 - Artscope`,
      description: standardLabel(profile.introduction).slice(0, 40),
      siteName: 'Artscope',
    },
  };
}

export default async function ProfileDetail({ params }: Props) {
  const profile = await fetchProfile(params.id);
  const historyArray = profile.history?.split('\n\n');
  return (
    <div className='py-3'>
      <div className='container max-w-screen-md px-2.5 flex flex-col items-stretch gap-1 text-[#1A1A1A]'>
        <ProfileComponent
          clickable={false}
          username={profile.username}
          name={profile.name}
          picture={profile.picture}
        />
        <hr className='bg-[#DFA36D] h-1.5 rounded-sm' />
        {profile.introduction && (
          <div className='p-6 text-xl'>
            {standardLabel(profile.introduction)}
          </div>
        )}
        <hr className='bg-[#DFA36D] h-1.5 rounded-sm' />
        {historyArray && (
          <div className='text-xl py-4'>
            {historyArray.map((history, index) => (
              <>
                {history.split('\n').map((line, index) => (
                  <p key={index} className='px-6 py-1'>
                    {standardLabel(line)}
                  </p>
                ))}
                <hr className='bg-[#DFA36D] h-1.5 rounded-sm my-3' />
              </>
            ))}
          </div>
        )}
      </div>
      <MembersArticleList username={profile.username} />
    </div>
  );
}
