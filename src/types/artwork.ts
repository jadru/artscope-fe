import { MediaType, pageInfoType } from '@/types/default';

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

export type ArtWorkApiResponseType = {
  artworks: ArtworkType[];
  pageInfo: pageInfoType;
};

export type ArtworkSearchApiResponseType = {
  artworks: DetailedArtworkType[];
  pageInfo: pageInfoType;
};

export type ArtWorkApiByMember = {
  artworks: DetailedArtworkType[];
  pageInfo: pageInfoType;
};

export type ArtworkType = {
  artwork: DetailedArtworkType;
  isLiked: boolean;
};

export type ArtworkApiResponseByUsernameType = {
  artworks: DetailedArtworkType[];
  pageInfo: pageInfoType;
};

export type DetailedArtworkType = {
  id: number;
  title: string;
  description: string;
  tags: string[];
  likes: number;
  authorUsername: string;
  authorIntroduction: string | null;
  authorProfileImage: string | null;
  authorCompanyName: string | null;
  authorCompanyRole: string | null;
  comments: number;
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
  artworkComments: artworkCommentType[];
  createdTime: Date;
  updatedTime: Date | null;
  views: number;
};

export type ArtworkListParams = {
  page: number;
  size: number;
  sortDirection?: 'ASC' | 'DESC';
};

export type artworkCommentType = {
  id: number;
  content: string;
  authorUsername: string;
  parentCommentId: number | null;
  authorName: string;
  authorDescription: string | null;
  authorProfileImageUrl: string | null;
  createdTime: Date;
  updatedTime: Date | null;
};
