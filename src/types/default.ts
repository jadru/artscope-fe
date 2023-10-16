export type MediaType = 'image' | 'video' | 'audio' | 'url';

export type pageInfoType = {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

export type contentType =
  | 'post'
  | 'artwork'
  | 'exhibition'
  | 'notice'
  | 'event'
  | 'faq'
  | 'qna'
  | 'review'
  | 'etc';
