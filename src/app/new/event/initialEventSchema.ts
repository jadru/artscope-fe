import { EventApiRequestType, ScheduleType } from '@/types/event';

export const initialEventSchema: EventApiRequestType = {
  dto: {
    title: '',
    description: '',
    eventType: 'STANDARD',
    price: 0,
    medias: [],
    thumbnail: { mediaType: 'image' },
    link: '',
    schedule: [],
  },
  mediaFiles: null,
  thumbnailFile: undefined,
};

export const initialScheduleSchema: ScheduleType = {
  id: 0,
  locationId: 1,
  startTime: new Date(Date.now()),
  endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
  detailLocation: '',
  eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  participants: [],
};
