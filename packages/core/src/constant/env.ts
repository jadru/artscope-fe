export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

export const GOOGLE_ANALYTICS_ID = process.env.GOOGLE_ANALYTICS_ID;

export const GOOGLE_TAG_MANAGER_ID = process.env.GOOGLE_TAG_MANAGER_ID;

export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

export const NEXT_PUBLIC_ROOT_URL = process.env.NEXT_PUBLIC_ROOT_URL;

export const NEXT_PUBLIC_MEDIA_STORAGE_URL =
  'https://' + process.env.NEXT_PUBLIC_MEDIA_STORAGE_URL;

export const S3_PATH = process.env.S3_PATH;

export const CRONITOR_ANALYTICS_KEY = process.env.CRONITOR_ANALYTICS_ID;

export const KAKAO_MAP_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

export const KAKAO_MAP_JS_API_KEY =
  process.env.NEXT_PUBLIC_KAKAO_MAP_JS_API_KEY;
