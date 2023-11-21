import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';
import StandardLabel, { standardLabel } from '@/components/StandardLabel';

import { ArtworkType } from '@/types/artwork';

export default function ArtworkProfile({ aw }: { aw: ArtworkType }) {
  return (
    <Link
      className='cursor-pointer p-0'
      href={`/profile/${aw.artwork.authorUsername}`}
    >
      <div className='flex flex-row items-start justify-start gap-2 p-3 transition hover:underline'>
        <ASNextImage
          src={aw.artwork.authorProfileImage ?? 'prod/images/default.jpg'}
          alt='프로필 사진'
          width={40}
          height={40}
          className='h-10 w-10 rounded-full border object-cover'
        />
        <div className='ml-0.5 flex flex-col transition hover:underline'>
          <p className='inline text-[0.9rem] font-bold'>
            <StandardLabel label={aw.artwork.authorName} />
          </p>
          <p className='line-clamp-1 text-[0.9rem] text-default-500'>
            @{aw.artwork.authorUsername}
            {aw.artwork.authorIntroduction
              ? ' • ' + standardLabel(aw.artwork.authorIntroduction)
              : ''}
          </p>
        </div>
      </div>
    </Link>
  );
}
