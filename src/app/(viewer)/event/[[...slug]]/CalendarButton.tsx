'use client';

import * as ics from 'ics';
import React from 'react';

import { EventDetailType } from '@/types/event';

type CalendarButtonProps = {
  data: EventDetailType;
} & React.ComponentProps<'button'>;

const CalendarButton = ({ ...props }: CalendarButtonProps) => {
  const handleIcs = async () => {
    const startTime = new Date(
      props.data.exhibitionList.eventSchedule[0].eventDate +
        ' ' +
        props.data.exhibitionList.eventSchedule[0].startTime
    );
    const endTime = new Date(
      props.data.exhibitionList.eventSchedule[0].eventDate +
        ' ' +
        props.data.exhibitionList.eventSchedule[0].endTime
    );
    ics.createEvent(
      {
        title: props.data.exhibitionList.title,
        start: [
          startTime.getFullYear(),
          startTime.getMonth() + 1,
          startTime.getDate(),
          startTime.getHours(),
          startTime.getMinutes(),
        ],
        description: props.data.exhibitionList.description,
        end: [
          endTime.getFullYear(),
          endTime.getMonth() + 1,
          endTime.getDate(),
          endTime.getHours(),
          endTime.getMinutes(),
        ],
        location:
          props.data.location.address +
          props.data.exhibitionList.eventSchedule[0].detailLocation +
          ' ' +
          props.data.location.name,
        geo: {
          lat: props.data.location.latitude,
          lon: props.data.location.longitude,
        },

        categories: [props.data.exhibitionList.eventType],
        attendees: props.data.exhibitionList.eventSchedule[0].participants.map(
          (participant) => {
            return {
              name: participant.name ?? '',
              dir: participant.username
                ? 'https://www.artscope.kr/profile/' + participant.username
                : undefined,
            };
          }
        ),
        url: 'https://www.artscope.kr/event/' + props.data.exhibitionList.id,
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
