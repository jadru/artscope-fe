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
