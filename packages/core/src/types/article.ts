import { pageInfoType } from '@/types/default';

export type articleListType = {
  magazines: articleItemType[];
  pageInfo: pageInfoType;
};

export type articleItemType = {
  id: number;
  title: string;
  content: string;
  mediaUrls: string[];
  category: string;
  views: number;
  likes: number;
  comments: number;
  author: authorType;
  createdTime: string;
  updatedTime: string;
  magazineComments: magazinCommentType[];
};

export type authorType = {
  authorUsername: string;
  authorName: string;
  authorProfileImage: string;
  authorCompanyName: string;
  authorCompanyRole: string;
};

export type articleCategoryType = {
  id: number;
  name: string;
  description?: string;
  createdTime: string;
  updatedTime: string;
};

export type magazinCommentType = {
  id: number;
  contents: string;
  likes: number;
  createdTime: string;
  updatedTime: string;
};
