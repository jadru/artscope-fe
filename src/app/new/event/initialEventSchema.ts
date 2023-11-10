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
  startTime: new Date(),
  endTime: new Date(),
  detailLocation: '',
  eventDate: new Date(),
  participants: [],
};
