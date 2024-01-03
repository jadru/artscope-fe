'use client';

import * as ics from 'ics';
import React from 'react';

import { standardLabel } from '@/components/StandardLabel';

import { EventDetailType } from '@/types/event';

type CalendarButtonProps = {
  data: EventDetailType;
} & React.ComponentProps<'button'>;

const CalendarButton = ({ ...props }: CalendarButtonProps) => {
  const handleIcs = async () => {
    const startTime = new Date(props.data.startDate);
    const endTime = new Date(props.data.endDate);
    ics.createEvent(
      {
        title: standardLabel(props.data.title),
        start: [
          startTime.getFullYear(),
          startTime.getMonth() + 1,
          startTime.getDate(),
          startTime.getHours(),
          startTime.getMinutes(),
        ],
        description: standardLabel(props.data.description),
        end: [
          endTime.getFullYear(),
          endTime.getMonth() + 1,
          endTime.getDate(),
          endTime.getHours(),
          endTime.getMinutes(),
        ],
        location:
          props.data.location.address +
          ' ' +
          standardLabel(props.data.location.name) +
          ' ' +
          standardLabel(props.data.detailLocation),
        geo: {
          lat: props.data.location.latitude,
          lon: props.data.location.longitude,
        },

        categories: [props.data.eventType],
        attendees: [],
        url: 'https://www.artscope.kr/event/' + props.data.id,
        alarms: [
          {
            action: 'display',
            trigger: {
              hours: 4,
              minutes: 0,
              before: true,
            },
          },
        ],
      },
      (error, value) => {
        if (error) {
          return;
        }
        window.open(encodeURI('data:text/calendar;charset=utf8,' + value));
      }
    );
  };
  return (
    <button onClick={handleIcs} {...props}>
      {props.children}
    </button>
  );
};

export default CalendarButton;
