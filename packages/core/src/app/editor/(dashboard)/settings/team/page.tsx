'use client';

import Link from 'next/link';

import useUserHook from '@/hooks/useUser';

import ASNextImage from '@/components/ASNextImage';
import FormCard from '@/components/FormCard';

import { useUser } from '@/states';

export default function TeamList() {
  useUserHook();
  const { user } = useUser();
  return (
    <FormCard title='내가 속한 팀'>
      <div>
        {user?.teams.map((team) => (
          <Link
            href={`/editor/settings/team/${team.id}`}
            key={team.id}
            className='w-full h-24 flex justify-between items-center rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200'>
            <ASNextImage
              src={team.profileImage ?? 'prod/images/default.jpg'}
              alt={team.name}
              className='rounded-full object-cover w-12 h-12'
              width={48}
              height={48}
            />
            {team.name}
          </Link>
        ))}
      </div>
    </FormCard>
  );
}
