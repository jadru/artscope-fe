'use client';

import { useRouter } from 'next/navigation';

import MarkdownVewer from '@/components/MarkdownViewer';

import { AgoraType } from '@/types/agora';

export default function AgoraItem({ agora }: { agora: AgoraType }) {
  const { push } = useRouter();
  return (
    <div
      className='cursor-pointer border-b p-4 hover:bg-default-100'
      onClick={() => push('/agora/' + agora.id)}
    >
      <h2>{agora.title}</h2>
      <div className='line-clamp-2'>
        <MarkdownVewer content={agora.content} />
      </div>
      <div className='mt-1 flex justify-between'>
        <p className='truncate rounded-r-lg border-l-3 border-red-600 bg-default-200 px-2 font-bold'>
          {agora.disagreeText} : {agora.disagreeCount}
        </p>
        <p className='truncate rounded-r-lg border-l-3 border-yellow-400 bg-default-200 px-2 font-bold'>
          {agora.naturalText} : {agora.naturalCount}
        </p>
        <p className='truncate rounded-r-lg border-l-3 border-blue-600 bg-default-200 px-2 font-bold'>
          {agora.agreeText} : {agora.agreeCount}
        </p>
      </div>
    </div>
  );
}
