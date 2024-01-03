import { addDays, format } from 'date-fns';

import { CreateEventType } from '@/types/event';

export const initialEventSchema: CreateEventType = {
  dto: {
    title: '',
    description: '',
    eventType: 'STANDARD',
    price: '',
    medias: [],
    thumbnail: { mediaType: 'image' },
    link: '',
    startDate: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 4), 'yyyy-MM-dd'),
  },
  mediaFiles: null,
  thumbnailFile: undefined,
};
