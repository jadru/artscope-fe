import { contentType } from '@/types/default';

export type feedApiResponseType = {
  feedItems: feedItemType[];
  hasNext: boolean;
  nextPage: number;
};

export type feedItemType = {
  id: number;
  title: string | null;
  content: string;
  type: contentType;
  thumbnailUrl: string | null;
  mediaUrls: string | null;
  authorUsername: string;
  authorName: string;
  authorDescription: string | null;
  authorProfileImageUrl: string | null;
  tags: string[] | null;
  categoryId: string;
  views: number;
  likes: number;
  isLiked: boolean;
  comments: number;
  createdTime: Date;
  updatedTime: Date | null;
};

export type SinglePostType = {
  id: number;
  content: string;
  views: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  authorUsername: string;
  authorName: string;
  mentionUsername: string | null;
  authorDescription: string | null;
  authorProfileImageUrl: string | null;
  createdTime: Date;
  updatedTime: Date | null;
  parentPostId: number | null;
  commentPosts: CommentPostType[];
};

export type CommentPostType = {
  id: number;
  content: string;
  comments: number;
  authorUsername: string;
  authorName: string;
  mentionUsername: string | null;
  authorProfileImageUrl: string | null;
  createdTime: Date;
  updatedTime: Date | null;
  parentCommentId: number | null;
  childComments: SinglePostType[];
};
