'use client';

import * as ics from 'ics';
import React from 'react';

import { EventDetailType } from '@/types/event';

type CalendarButtonProps = {
  data: EventDetailType;
  scheduleid: number;
} & React.ComponentProps<'button'>;

const CalendarButton = ({ ...props }: CalendarButtonProps) => {
  const thisSchedule = props.data.eventSchedules.filter(
    (ii) => ii.id === props.scheduleid
  )[0];
  const handleIcs = async () => {
    const startTime = new Date(
      thisSchedule.eventDate + ' ' + thisSchedule.startTime
    );
    const endTime = new Date(
      thisSchedule.eventDate + ' ' + thisSchedule.endTime
    );
    ics.createEvent(
      {
        title: props.data.title,
        start: [
          startTime.getFullYear(),
          startTime.getMonth() + 1,
          startTime.getDate(),
          startTime.getHours(),
          startTime.getMinutes(),
        ],
        description: props.data.description,
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
          props.data.location.name +
          ' ' +
          thisSchedule.detailLocation,
        geo: {
          lat: props.data.location.latitude,
          lon: props.data.location.longitude,
        },

        categories: [props.data.eventType],
        attendees: thisSchedule.participants.map((participant) => {
          return {
            name: participant.name ?? '',
            dir: participant.username
              ? 'https://www.artscope.kr/profile/' + participant.username
              : undefined,
          };
        }),
        url:
          'https://www.artscope.kr/event/' +
          props.data.id +
          '?scheduleId=' +
          props.scheduleid,
        alarms: [
          {
            action: 'display',
            trigger: {
              hours: 1,
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
