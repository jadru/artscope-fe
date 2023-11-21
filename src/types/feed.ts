import { contentType, MediaType, pageInfoType } from '@/types/default';
import { EventType } from '@/types/event';

export type feedApiResponseType = {
  feedItems: feedItemType[];
  hasNext: boolean;
  nextPage: number;
};

export type feedItemType = {
  id: number;
  title: string | undefined;
  content: string;
  type: contentType;
  thumbnailUrl: string | undefined;
  mediaUrls: string[] | undefined;
  authorUsername: string;
  authorName: string;
  authorDescription: string | undefined;
  authorProfileImageUrl: string | undefined;
  authorCompanyName: string | undefined;
  authorCompanyRole: string | undefined;
  tags: string[] | undefined;
  categoryId: string;
  views: number;
  likes: number;
  isLiked: boolean;
  comments: number;
  createdTime: Date;
  updatedTime: Date | undefined;

  // only for exhibition
  event: {
    eventType: EventType;
    startDateTime: Date;
    endDateTime: Date;
    locationName: string;
    locationAddress: string;
    detailLocation: string;
  };

  // only for agora
  agoraAgreeCount: number;
  agoraDisagreeCount: number;
  agoraNaturalCount: number;
  agreeText: string;
  disagreeText: string;
  naturalText: string;
  participantCount: number;
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
  likeMembers: { username: string; name: string; likedTime: Date }[];
  medias: {
    id: number;
    mediaType: MediaType;
    mediaUrl: string;
    imageHeight: number;
    imageWidth: number;
  }[];
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

export type PostListResponse = {
  posts: SinglePostType[];
  pageInfo: pageInfoType;
};

export type PostApiRequestType = {
  dto: {
    content: string;
    medias:
      | {
          mediaType: MediaType;
        }[]
      | null;
    thumbnail: {
      mediaType: MediaType;
    } | null;
  };
  mediaFiles: File[] | null;
  thumbnailFile?: File | null;
};
