export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

export const GA_TRACKING_ID = 'G-Q0QQE9ZHG0';

export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const NEXT_PUBLIC_ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export const NEXT_PUBLIC_MEDIA_STORAGE_URL =
  'https://' + process.env.NEXT_PUBLIC_MEDIA_STORAGE_URL;
