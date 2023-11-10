import { MediaType, pageInfoType } from '@/types/default';
import { LocationType } from '@/types/location';

export type EventDetailType = {
  exhibitionList: SingleEventType;
  detailLocation: string;
  price: number;
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
    mediaUrl: string;
  };
  medias: {
    mediaType: 'image' | 'video';
    mediaUrl: string;
  }[];
  eventType: EventType;
  link: string;
  createdTime: Date;
  updatedTime: Date | null;
  author: string;
  eventSchedule: ScheduleResponseType[];
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

export type ScheduleResponseType = {
  id: number;
  locationId: number;
  detailLocation: string;
  startTime: string; // '20:00'
  endTime: string; // '20:00'
  eventDate: string; // '2021-08-01'
  participants: ParticipantType[];
  locationAddress: string;
  locationName: string;
  updatedTime?: Date;
  createdTime: Date;
};

export type ParticipantType = {
  name?: string;
  username?: string;
};
