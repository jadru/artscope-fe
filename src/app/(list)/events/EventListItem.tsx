import { format } from 'date-fns';
import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';

import { SingleEventType } from '@/types/event';

export default function EventListItem({ event }: { event: SingleEventType }) {
  return (
    <Link
      className='group flex flex-row justify-between bg-white py-4 pl-8 hover:bg-default-100 group-hover:bg-default-100 md:pl-52'
      href={`/event/${event.id}?scheduleId=${event.eventSchedule[0].id}`}
    >
      <div>
        <h3>{event.title}</h3>
        <h4>{event.description}</h4>
        <h5>
          {format(new Date(event.eventSchedule[0].eventDate), 'yyyy-MM-dd')}
        </h5>
        <h5>
          {event.eventSchedule[0].startTime} - {event.eventSchedule[0].endTime}
        </h5>
      </div>
      <ASNextImage
        src={event.thumbnail.mediaUrl}
        alt='thumbnail'
        width={100}
        height={100}
      />
    </Link>
  );
}
