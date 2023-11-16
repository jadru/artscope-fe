export type MediaType = 'image' | 'video' | 'audio' | 'url';

export type pageInfoType = {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

export type sortDirectionType = 'ASC' | 'DESC';

export type contentType =
  | 'post'
  | 'artwork'
  | 'exhibition'
  | 'agora'
  | 'notice'
  | 'event'
  | 'faq'
  | 'qna'
  | 'review'
  | 'etc';
