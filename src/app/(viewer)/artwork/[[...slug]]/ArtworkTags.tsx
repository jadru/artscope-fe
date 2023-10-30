'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { ArtworkType } from '@/types/artwork';

export default function ArtworkTags({ data }: { data: ArtworkType }) {
  const { push } = useRouter();
  return data.artwork.tags.length > 0 ? (
    <div className='mx-2 flex flex-wrap gap-1'>
      {data.artwork.tags.map(
        (value) =>
          value !== '' && (
            <button
              onClick={() => push('/search?c=' + value)}
              key={value}
              className='rounded-full border border-transparent bg-default-100 px-2 pb-0.5 pt-1 font-bold text-default-600 transition-colors duration-200 hover:border-default-800 hover:bg-default-200'
            >
              #{value}
            </button>
          )
      )}
    </div>
  ) : (
    <div></div>
  );
}
