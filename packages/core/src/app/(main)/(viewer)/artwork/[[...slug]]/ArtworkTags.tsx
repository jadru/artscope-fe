import Link from 'next/link';
import React from 'react';

export default function ArtworkTags({ tags }: { tags: string[] }) {
  return tags.length > 0 && !(tags.length === 1 && tags[0] === '') ? (
    <div className='flex flex-wrap gap-1'>
      {tags.map(
        (value) =>
          value !== '' && (
            <Link
              href={'/search?c=' + value}
              key={value}
              className='border-default-300 bg-default-100 text-default-600 hover:border-default-800 hover:bg-default-200 rounded-full border px-2 pb-0.5 pt-1 transition-colors duration-200'
            >
              {value}
            </Link>
          )
      )}
    </div>
  ) : (
    <></>
  );
}
