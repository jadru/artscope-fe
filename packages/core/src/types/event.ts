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
  eventSchedules: ScheduleResponseType[];
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
    mediaUrl: string | null;
  };
  medias: {
    mediaType: 'image' | 'video';
    mediaUrl: string | null;
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
  exhibitions: SingleEventTypeOnList[];
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
  eventSchedule: ScheduleResponseType;
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
    price: number;
    schedule: CreateScheduleType[];
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
  locationId: number;
  detailLocation: string;
  startDateTime: Date;
  endDateTime: Date;
  participants: ParticipantType[];
};

export type CreateScheduleType = {
  locationId: number;
  detailLocation: string;
  startDateTime: string;
  endDateTime: string;
  participants: ParticipantType[];
};

export type CreateScheduleTempType = {
  id: number;
  locationId?: number;
  locationName?: string;
  detailLocation: string;
  startDateTime: Date;
  endDateTime: Date;
  participants: ParticipantType[];
};

export type ScheduleResponseType = {
  id: number;
  locationId: number;
  detailLocation: string;
  startDateTime: Date;
  endDateTime: Date;
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
