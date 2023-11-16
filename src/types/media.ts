import { MediaType } from '@/types/default';

export type MediaTypeInfoWithDescription = {
  id: number;
  mediaType: MediaType;
  mediaUrl: string;
  imageHeight: number;
  imageWidth: number;
  description: string;
};

export type MediaTypeInfo = {
  id: number;
  mediaType: MediaType;
  mediaUrl: string;
  imageHeight: number;
  imageWidth: number;
};
