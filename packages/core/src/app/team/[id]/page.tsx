import { Metadata, ResolvingMetadata } from 'next';

import ASNextImage from '@/components/ASNextImage';
import StandardLabel, { standardLabel } from '@/components/StandardLabel';

import { NEXT_PUBLIC_API_URL } from '@/constant/env';
import jxios from '@/utils/jxios';

import { TeamDetailType } from '@/types/team';

const fetchTeam = async (id: string) => {
  return await jxios
    .get(`${NEXT_PUBLIC_API_URL}/api/teams/${id}`)
    .then((res) => res.data as TeamDetailType);
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

  const team = await fetchTeam(id);

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: `${standardLabel(team.name)} - Artscope`,
    description: standardLabel(team.description).slice(0, 40),
    openGraph: {
      images: [team.profileImage, ...previousImages],
      title: `${standardLabel(team.name)} - Artscope`,
      description: standardLabel(team.description).slice(0, 40),
      siteName: 'Artscope',
    },
  };
}

export default async function ProfileDetail({ params }: Props) {
  const team = await fetchTeam(params.id);
  return (
    <div className='py-3'>
      <div className='container max-w-screen-md px-2.5 flex flex-col items-stretch gap-1 text-[#1A1A1A]'>
        <div
          className={`
          flex flex-row items-center w-full justify-between transition-colors gap-2 p-6 h-48 text-[#1A1A1A] relative overflow-hidden
        }`}>
          <ASNextImage
            src={team.backgroundImage}
            alt='background-image'
            width='800'
            height='400'
            className='w-full object-cover absolute top-0 left-0 z-0'
          />
          <div className='w-full h-full bg-black opacity-50 absolute top-0 left-0 z-0' />
          <div className='ml-0.5 flex flex-col transition z-10 text-white'>
            <p className='inline text-2xl font-bold'>
              <StandardLabel label={team.name} />
            </p>
            <p className='text-default-500 line-clamp-1 text-lg'>
              {team.address}
            </p>
          </div>
          <ASNextImage
            src={team.profileImage ?? 'prod/images/default.jpg'}
            alt='프로필 사진'
            width={64}
            height={64}
            className='h-16 w-16 rounded-full object-cover z-10'
          />
        </div>
        {team.description && (
          <div className='p-6 text-xl'>{standardLabel(team.description)}</div>
        )}
      </div>
    </div>
  );
}
