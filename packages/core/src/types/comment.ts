import { AuthorType } from '@/types/article';

export type CommentType = {
  id: number;
  comment: string;
  mentionUsername: string | null;
  comments: number;
  author: AuthorType;
  createdTime: string;
  updatedTime: string;
  parentCommentId: number | null;
  childComments: CommentType[];
};
