export const isProd = process.env.NODE_ENV === 'production';
export const isLocal = process.env.NODE_ENV === 'development';

export const showLogger = isLocal
  ? true
  : process.env.NEXT_PUBLIC_SHOW_LOGGER === 'true' ?? false;

export const NEXT_PUBLIC_MEDIA_STORAGE_URL =
  'https://d14sxnpwbfro1f.cloudfront.net';

export const GA_TRACKING_ID = 'G-Q0QQE9ZHG0';

export const OAUTH2_GOOGLE_URI =
  'https://api.artscope.kr/oauth2/authorization/google';
