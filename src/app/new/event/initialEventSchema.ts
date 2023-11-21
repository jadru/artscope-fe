import { add } from 'date-fns';

import { CreateEventType, CreateScheduleTempType } from '@/types/event';

export const initialEventSchema: CreateEventType = {
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

export const initialScheduleSchema: CreateScheduleTempType = {
  id: 0,
  locationId: undefined,
  locationName: '',
  startDateTime: add(new Date(), { hours: 1 }),
  endDateTime: add(new Date(), { hours: 3 }),
  detailLocation: '',
  participants: [],
};
