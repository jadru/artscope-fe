export type ArtWorkMediaType = {
  mediaType: MediaType;
  file?: File;
  description: string;
  linkUrl?: string;
};

export type ArtWorkApiRequestType = {
  dto: {
    description: string;
    medias: {
      mediaType: MediaType;
      description: string;
    }[];
    title: string;
    tags: string[];
    thumbnail: {
      mediaType: MediaType;
      description: string;
    };
    visible: boolean;
  };
  mediaFiles: File[];
  thumbnailFile?: File;
};

export type MediaType = 'image' | 'video' | 'audio' | 'url';

export type ArtWorkApiResponseType = {
  artworks: ArtworkType[];
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
};

export type ArtWorkApiByMember = {
  artworks: DetailedArtworkType[];
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
};

export type ArtworkType = {
  artwork: DetailedArtworkType;
  isLike: boolean;
};

export type DetailedArtworkType = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  likes: number;
  authorUsername: string;
  authorName: string;
  thumbnail: {
    id: number;
    mediaType: MediaType;
    mediaUrl: string;
    imageHeight: number;
    imageWidth: number;
    description: string;
  };
  artworkMedias: {
    id: number;
    mediaType: MediaType;
    mediaUrl: string;
    imageHeight: number;
    imageWidth: number;
    description: string;
  }[];
  createdTime: Date;
  updatedTime: Date | null;
  views: number;
};

export type profileApiType = {
  username: string;
  name: string;
  email: string;
  picture: string;
  oauthProvider: null | 'google' | 'naver';
  artistStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  snsUrl: string;
  websiteUrl: string;
  introduction: string;
  history: string;
  authrities: roleType;
  createdTime: Date;
  updatedTime: Date | null;
};

export type generalProfileApiType = {
  artistStatus: 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
  createdTime: Date;
  email: string;
  history: string;
  introduction: string;
  name: string;
  picture: string;
  snsUrl: string;
  username: string;
  websiteUrl: string;
};

export type profileApiRequestType = {
  email?: string;
  history?: string;
  introduction?: string;
  name?: string;
  snsUrl?: string;
  websiteUrl?: string;
};

export type likeMemberApiResponseType = {
  memberUsernames: string[];
  likes: number;
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
};

export type likeArtworksByMemberApiResponseType = {
  dtos: { artworkId: number; likedTime: Date }[];
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
};

export type decodedAccessTokenType = {
  sub: string;
  exp: number;
  auth: string;
};

export type decodedRefreshTokenType = {
  sub: string;
  exp: number;
  type: 'refresh';
};

export type roleType = (
  | 'ROLE_GUEST'
  | 'ROLE_USER'
  | 'ROLE_ARTIST'
  | 'ROLE_ADMIN'
)[];

export type feedApiResponseType = {
  feedItems: feedItemType[];
  hasNext: boolean;
  nextPage: number;
};

export type feedItemType = {
  id: number;
  title: string;
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
  comments: number;
  createdTime: Date;
  updatedTime: Date | null;
};

// eslint-disable-next-line unused-imports/no-unused-vars
type pageInfoType = {
  page: number;
  size: number;
  totalPages: number;
  totalElements: number;
};

export type contentType =
  | 'post'
  | 'artwork'
  | 'artist'
  | 'notice'
  | 'event'
  | 'faq'
  | 'qna'
  | 'review'
  | 'etc';

export interface ArtistForm {
  introduction: string;
  history: string;
  snsUrl: string;
  websiteUrl: string | undefined;
}

export type ArtworkListParams = {
  page: number;
  size: number;
  sortDirection?: 'ASC' | 'DESC';
};
