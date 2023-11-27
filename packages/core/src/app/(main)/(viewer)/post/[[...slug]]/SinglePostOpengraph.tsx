'use client';

import { useEffect, useState } from 'react';

import OpengraphCard from '@/app/(main)/(list)/(feed)/OpengraphCard';
import textInUrlSeperator from '@/utils/textInUrlSeperator';

export default function SinglePostOpengraph({ content }: { content: string }) {
  const [firstLink, setFirstLink] = useState<string>();
  useEffect(() => {
    for (const item of textInUrlSeperator(content.replace(/<[^>]*>?/g, ''))) {
      if (item.type === 'link') {
        setFirstLink(item.value);
        break;
      }
    }
  }, [content]);
  return (
    <div className='rounded-2xl !bg-white'>
      <OpengraphCard externalUrl={firstLink} />
    </div>
  );
}
