export type ArtWorkMediaType = {
  mediaType: MediaType;
  mediaUrl: string;
  file: File;
  description: string;
};

export type ArtWorkType = {
  description: string;
  mediaUrls?: {
    mediaType: MediaType;
    mediaUrl: string;
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
