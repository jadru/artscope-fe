import { ImageLoaderProps } from 'next/image';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  if (!src.startsWith('http')) {
    return `${NEXT_PUBLIC_MEDIA_STORAGE_URL}/${src}?w=${width}&q=${
      quality || 75
    }&f=webp`;
  } else {
    return `${src}?w=${width}&q=${quality || 75}`;
  }
};

// eslint-disable-next-line import/no-default-export
export default imageLoader;
