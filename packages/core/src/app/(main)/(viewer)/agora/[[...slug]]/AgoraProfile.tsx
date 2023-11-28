import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';
import StandardLabel from '@/components/StandardLabel';

import { AgoraDetailType } from '@/types/agora';

export default function AgoraProfile({ agora }: { agora: AgoraDetailType }) {
  return (
    <Link
      className='cursor-pointer p-0'
      href={`/profile/${agora.agora.author.username}`}
    >
      <div className='flex flex-row items-start justify-start gap-2 p-3 transition hover:underline'>
        <ASNextImage
          src={agora.agora.author.profileImageUrl ?? 'prod/images/default.jpg'}
          alt='프로필 사진'
          width={40}
          height={40}
          className='h-10 w-10 rounded-full border object-cover'
        />
        <div className='ml-0.5 flex flex-col transition hover:underline'>
          <p className='inline text-[0.9rem] font-bold'>
            <StandardLabel label={agora.agora.author.name} />
          </p>
          <p className='text-default-500 line-clamp-1 text-[0.9rem]'>
            @{agora.agora.author.username}
          </p>
        </div>
      </div>
    </Link>
  );
}
