import { MediaType } from '@/types/default';
import { MediaTypeInfo } from '@/types/media';

export type CreateAgoraType = {
  dto: {
    title: string;
    content: string;
    isAnonymous: boolean;
    agreeText: string;
    naturalText: string;
    disagreeText: string;
    thumbnail?: {
      mediaType: MediaType;
    };
    medias?: {
      mediaType: MediaType;
    }[];
  };
  mediaFiles?: File[];
  thumbnailFile?: File;
};

export type AgoraDetailType = {
  agora: {
    id: number;
    title: string;
    content: string;
    agreeCount: number;
    naturalCount: number;
    disagreeCount: number;
    participantCount: number;
    agreeText: string;
    naturalText: string;
    disagreeText: string;
    isAnonymous: boolean;
    author: AgoraAuthorType;
    thumbnail: MediaTypeInfo;
    medias: MediaTypeInfo[];
    createdTime: string;
    updatedTime: string | null;
  };
  agreeOpinions: AgoraOpinionType[];
  naturalOpinions: AgoraOpinionType[];
  disagreeOpinions: AgoraOpinionType[];
};

export type AgoraOpinionType = {
  content: string;
  vote: string;
  author: AgoraAuthorType;
  createdTime: string;
  updatedTime: string | null;
};

export type AgoraAuthorType = {
  name: string;
  username: string | null;
  profileImageUrl: string | null;
};
