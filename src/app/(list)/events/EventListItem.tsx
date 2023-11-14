import { format } from 'date-fns';
import Link from 'next/link';

import ASNextImage from '@/components/ASNextImage';
import MarkdownVewer from '@/components/MarkdownViewer';

import { SingleEventTypeOnList } from '@/types/event';

export default function EventListItem({
  event,
}: {
  event: SingleEventTypeOnList;
}) {
  return (
    <Link
      className='group flex h-44 flex-row items-center justify-between rounded-2xl bg-white px-4 py-4 pl-8 transition hover:bg-default-100 group-hover:bg-default-100 md:pl-52'
      href={`/event/${event.id}?scheduleId=${event.eventSchedule.id}`}
    >
      <div>
        <h3>{event.title}</h3>
        <div className='line-clamp-2'>
          <MarkdownVewer content={event.description} />
        </div>
        <h5>
          {format(new Date(event.eventSchedule.eventDate), 'yyyy-MM-dd')}{' '}
          {event.eventSchedule.startTime} - {event.eventSchedule.endTime}
        </h5>
      </div>
      <ASNextImage
        className='h-full'
        src={event.thumbnail?.mediaUrl ?? 'prod/images/default.jpg'}
        alt='thumbnail'
        width={130}
        height={130}
      />
    </Link>
  );
}
