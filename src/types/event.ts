import { pageInfoType } from '@/types/default';

export type SingleEventType = {
  id: number;
  title: string;
  description: string;
  thumbnail: {
    mediaType: 'image' | 'video';
    mediaUrl: string;
  };
  link: string;
  startDate: Date;
  endDate: Date;
  createdTime: Date;
  updatedTime: Date | null;
  author: string;
};

export type EventResponseType = {
  exhibitions: SingleEventType[];
  pageInfo: pageInfoType;
};

export type EventViewType = {
  date: string;
  event: SingleEventType[];
}[];
