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
  | 'event'
  | 'agora'
  | 'notice'
  | 'faq'
  | 'qna'
  | 'review'
  | 'etc';
