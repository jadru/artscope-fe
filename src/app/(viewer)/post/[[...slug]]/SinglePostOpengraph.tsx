'use client';

import { useEffect, useState } from 'react';

import OpengraphCard from '@/app/(list)/(feed)/OpengraphCard';
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
  return <OpengraphCard externalUrl={firstLink} />;
}
