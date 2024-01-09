import { MediaType, pageInfoType } from '@/types/default';
import { LocationType } from '@/types/location';

export type EventDetailType = {
  id: number;
  title: string;
  description: string;
  authorUserName: string;
  authorProfileImage?: string;
  authorName: string;
  thumbnail: {
    mediaType: 'image' | 'video';
    mediaUrl: string;
  } | null;
  medias:
    | {
        mediaType: 'image' | 'video';
        mediaUrl: string;
      }[]
    | null;
  link: string;
  eventType: EventType;
  startDate: string;
  endDate: string;
  detailLocation: string;
  price: string;
  updatedTime: Date | null;
  createdTime: Date;
  location: LocationType;
};

export type SingleEventType = {
  id: number;
  title: string;
  description: string;
  thumbnail: {
    mediaType: 'image' | 'video';
    mediaUrl: string | null;
  };
  medias: {
    mediaType: 'image' | 'video';
    mediaUrl: string | null;
  }[];
  eventType: EventType;
  link: string;
  price: string;
  createdTime: Date;
  updatedTime: Date | null;
  author: string;
  startDate: string;
  endDate: string;
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
  description: string;
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
  events: SingleEventTypeOnList[];
  pageInfo: pageInfoType;
};

export type SingleEventTypeOnList = {
  id: number;
  title: string;
  thumbnail: {
    mediaType: 'image' | 'video';
    mediaUrl: string | null;
  };
  eventType: EventType;
  createdTime: Date;
  updatedTime: Date | null;
  author: string;
  locationName: string;
  detailLocation: string;
  startDate: string;
  endDate: string;
};

export type EventViewType = {
  date: string;
  dayOfWeek: string;
  dayOfWeekKor: string;
  event: SingleEventTypeOnList[];
};

export type CreateEventType = {
  dto: {
    title: string;
    description: string;
    eventType: EventType;
    link: string;
    price: string;
    startDate: string;
    endDate: string;
    medias:
      | {
          mediaType: MediaType;
        }[]
      | null;
    thumbnail: {
      mediaType: MediaType;
    } | null;
    locationId: number;
    detailLocation: string;
  };
  mediaFiles: File[] | null;
  thumbnailFile?: File | null;
};

export type ParticipantType = {
  name?: string;
  username?: string;
};
