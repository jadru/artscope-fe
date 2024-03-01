import { pageInfoType } from '@/types/default';

export type articleListType = {
  magazines: articleItemType[];
  pageInfo: pageInfoType;
};

export type articleItemType = {
  id: number;
  title: string;
  contents: string;
  category: string;
  views: number;
  likes: number;
  comments: number;
  author: authorType;
  createdTime: string;
  updatedTime: string;
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
