import { MediaType, pageInfoType } from '@/types/default';

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

export type EventType =
  | 'EXHIBITION'
  | 'LECTURE'
  | 'WORKSHOP'
  | 'SPECIAL'
  | 'CONCERT'
  | 'STANDARD';

export type EventTypeLabel = {
  label: string;
  value: EventType;
}[];

export type SearchEventType =
  | 'ALL'
  | 'EXHIBITION'
  | 'LECTURE'
  | 'WORKSHOP'
  | 'SPECIAL'
  | 'CONCERT'
  | 'STANDARD';

export type EventResponseType = {
  exhibitions: SingleEventType[];
  pageInfo: pageInfoType;
};

export type EventViewType = {
  date: string;
  event: SingleEventType[];
}[];

export type EventApiRequestType = {
  dto: {
    title: string;
    description: string;
    eventType: EventType;
    link: string;
    price: number;
    schedule: ScheduleType[];
    medias:
      | {
          mediaType: MediaType;
        }[]
      | null;
    thumbnail: {
      mediaType: MediaType;
    } | null;
  };
  mediaFiles: File[] | null;
  thumbnailFile?: File | null;
};

export type ScheduleType = {
  id?: number;
  locationId: number;
  detailLocation: string;
  startTime: Date; // '20:00'
  endTime: Date; // '20:00'
  eventDate: Date; // '2021-08-01'
  participants: ParticipantType[];
};

export type ParticipantType = {
  name?: string;
  username?: string;
};
