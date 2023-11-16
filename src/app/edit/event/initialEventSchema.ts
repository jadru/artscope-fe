import { add } from 'date-fns';

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
  endTime: add(new Date(), {
    hours: 4,
  }),
  detailLocation: '',
  eventDate: new Date(),
  participants: [],
};
