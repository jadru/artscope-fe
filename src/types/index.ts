export type ArtWorkMediaType = {
  mediaType: MediaType;
  mediaUrl: string;
  file: File;
  description: string;
};

export type ArtWorkType = {
  description: string;
  mediaUrls: {
    mediaType: MediaType;
    mediaUrl: string;
    description: string;
  }[];
  title: string;
  visible: boolean;
};

export type MediaType = 'image' | 'video';

export type ArtWorkApiResponseType = {
  artworks: {
    id: number;
    title: string;
    description: string;
    member: string;
    thumbnail: {
      id: number;
      mediaType: MediaType;
      mediaUrl: string;
    };
    artworkMedias: {
      id: number;
      mediaType: MediaType;
      mediaUrl: string;
    }[];
    createdTime: Date;
    updatedTime: Date | null;
  }[];
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
};

export type decodedTokenType = {
  sub: string;
  exp: number;
  auth: string;
};

export type profileApiType = {
  username: string;
  name: string;
  email: string;
  picture: string;
  oauthProvider: null | 'google' | 'naver';
  activated: boolean;
  artistStatus: artistStatusType;
  snsUrl: string;
  websiteUrl: string;
  introduction: string;
  history: string;
  authrities: roleType[];
  createdTime: Date;
  updatedTime: Date | null;
};

export type artistStatusType = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';
export type roleType =
  | 'ROLE_GUEST'
  | 'ROLE_USER'
  | 'ROLE_ARTIST'
  | 'ROLE_ADMIN';
