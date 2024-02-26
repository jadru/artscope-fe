import { pageInfoType } from '@/types/default';

export type magazineListType = {
  magazines: magazineItemType[];
  pageInfo: pageInfoType;
};

export type magazineItemType = {
  id: number;
  title: string;
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

export type categoryType = {
  id: number;
  name: string;
  description?: string;
  createdTime: string;
  updatedTime: string;
};
