export type ArtWorkMediaType = {
  mediaType: MediaType;
  file: File;
  description: string;
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

export type MediaType = 'image' | 'video' | 'audio';

export type ArtWorkApiResponseType = {
  artworks: ArtworkType[];
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
    totalElements: number;
  };
};

export type ArtworkType = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  member: string;
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

export type profileApiRequestType = {
  email?: string;
  history?: string;
  introduction?: string;
  name?: string;
  snsUrl?: string;
  websiteUrl?: string;
};
