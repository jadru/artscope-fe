import { CommentType } from '@/types/comment';
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
  author: AuthorType;
  teamName: string | null;
  teamId: number | null;
  isLiked: boolean;
  createdTime: string;
  updatedTime: string;
  magazineComments: CommentType[];
};

export type AuthorType = {
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
