import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';
import StandardLabel from '@/components/StandardLabel';

export default function ProfileCard({
  username,
  name,
  picture,
}: {
  username: string;
  name: string;
  picture?: string;
}) {
  return (
    <Link
      href={'/profile/' + username}
      className='hover:bg-default-100 flex appearance-none items-center justify-between rounded-2xl border-2 p-3 transition'>
      <div className='flex flex-col items-start justify-center'>
        <p className='text-lg font-bold'>
          <StandardLabel label={name} /> 작가
        </p>
        <p className='text-sm'>@{username}</p>
      </div>
      {picture ? (
        <ASNextImage
          src={picture ?? 'prod/images/default.jpg'}
          // eslint-disable-next-line
          alt={name + "'s profile image"}
          width={60}
          height={60}
          className='h-16 w-16 rounded-full border object-cover'
        />
      ) : (
        <></>
      )}
    </Link>
  );
}
