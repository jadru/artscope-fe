import { CreateScheduleType, EventApiRequestType } from '@/types/event';

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

export const initialScheduleSchema: CreateScheduleType = {
  id: 0,
  locationId: undefined,
  locationName: '',
  startTime: new Date(),
  endTime: new Date(),
  detailLocation: '',
  eventDate: new Date(),
  participants: [],
};
