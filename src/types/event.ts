import { pageInfoType } from '@/types/default';

export type normalEventType = {
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
  exhibitions: normalEventType[];
  pageInfo: pageInfoType;
};

export type EventViewType = {
  date: string;
  event: normalEventType[];
}[];
