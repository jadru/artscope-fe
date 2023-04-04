export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

export const NEXT_PUBLIC_MEDIA_STORAGE_URL =
  'https://media-xi-art-storage.s3.ap-northeast-2.amazonaws.com';
