import { ImageLoaderProps } from 'next/image';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  return `${NEXT_PUBLIC_MEDIA_STORAGE_URL}/${src}?w=${width}&q=${
    quality || 75
  }&f=webp`;
};

// eslint-disable-next-line import/no-default-export
export default imageLoader;
