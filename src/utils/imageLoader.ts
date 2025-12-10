import { ImageLoaderProps } from 'next/image';

import { NEXT_PUBLIC_MEDIA_STORAGE_URL } from '@/constant/env';

const imageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  // If URL doesn't start with http:// or https://, prepend the media storage URL
  if (!src.startsWith('http://') && !src.startsWith('https://')) {
    // Remove leading slash if present to avoid double slashes
    const cleanSrc = src.startsWith('/') ? src.slice(1) : src;
    return `${NEXT_PUBLIC_MEDIA_STORAGE_URL}/${cleanSrc}?w=${width}&q=${
      quality || 80
    }&f=webp&t=inside`;
  } else if (src.startsWith(NEXT_PUBLIC_MEDIA_STORAGE_URL)) {
    return `${src}?w=${width}&q=${quality || 80}&f=webp&t=inside`;
  } else {
    return `${src}`;
  }
};

export default imageLoader;
