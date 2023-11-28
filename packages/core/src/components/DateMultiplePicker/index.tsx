import {
  addMonths,
  addYears,
  eachDayOfInterval,
  endOfMonth,
  getDay,
  startOfDay,
  startOfMonth,
  subMonths,
  subYears,
} from 'date-fns';
import React, { useEffect } from 'react';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

export default function Index({
  startDate = subYears(new Date(), 100),
  endDate = addYears(new Date(), 100),
  scheduleDate = [],
  onDateChangeRange,
  onDateChangeMultiple,
  multiple,
}: {
  multiple?: boolean;
  startDate?: Date;
  endDate?: Date;
  scheduleDate?: Date[];
  onDateChangeRange?: (date: Date[]) => void;
  onDateChangeMultiple?: (date: Date[]) => void;
}) {
  const [standardDate, setStandardDate] = React.useState<Date>(new Date());
  const [monthView, setMonthView] = React.useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date[]>(scheduleDate);
  const [hoverDate, setHoverDate] = React.useState<Date>();

  useEffect(() => {
    setMonthView(
      eachDayOfInterval({
        start: startOfMonth(startOfDay(standardDate)),
        end: endOfMonth(standardDate),
      }).filter((date) => date >= startDate && date <= endDate)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [standardDate]);

  useEffect(() => {
    if (startDate > standardDate) {
      setStandardDate(startDate);
    }
    if (endDate < standardDate) {
      setStandardDate(endDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (multiple) {
      onDateChangeMultiple && onDateChangeMultiple(selectedDate);
    } else {
      onDateChangeRange && onDateChangeRange(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const handleDateClick = React.useCallback(
    (date: Date) => {
      setSelectedDate((prev) => {
        const index = prev.findIndex(
          (d) => d.toDateString() === date.toDateString()
        );
        if (index !== -1) {
          const newSelectedDate = [...prev];
          newSelectedDate.splice(index, 1);
          return newSelectedDate;
        } else {
          if (!multiple && prev.length === 2) {
            return [date];
          }
          return [...prev, date].sort((a, b) => a.getTime() - b.getTime());
        }
      });
    },
    [multiple]
  );

  const getDayClass = React.useCallback(
    (day: Date) => {
      if (
        selectedDate.find((date) => date.toDateString() === day.toDateString())
      ) {
        return 'bg-primary text-white';
      } else if (
        !multiple &&
        hoverDate &&
        (hoverDate.toDateString() === day.toDateString() ||
          (selectedDate.length === 1 &&
            day >= selectedDate[0] &&
            day <= hoverDate) ||
          (selectedDate.length === 1 &&
            day <= selectedDate[0] &&
            day >= hoverDate))
      ) {
        return 'bg-default-200';
      } else if (
        !multiple &&
        selectedDate.length === 2 &&
        day > selectedDate[0] &&
        day < selectedDate[1]
      ) {
        return 'bg-primary text-white';
      } else {
        return 'bg-default-100 hover:bg-primary-200';
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hoverDate, selectedDate]
  );

  return (
    <div>
      <div className='flex w-full justify-between'>
        <button
          className={`
           flex items-center gap-1 text-xl transition
           ${
             subMonths(endOfMonth(standardDate), 1) >= startDate
               ? 'hover:text-primary cursor-pointer'
               : 'text-default-300 cursor-default'
           }
          `}
          onClick={() => {
            const newDate = subMonths(endOfMonth(standardDate), 1);
            if (
              newDate >= startDate &&
              newDate.toDateString() !== standardDate.toDateString()
            ) {
              setStandardDate(newDate);
            }
          }}
        >
          <AiOutlineArrowLeft />
          {subMonths(standardDate, 1).getMonth() + 1}월
        </button>
        <p className='text-2xl'>
          {standardDate.getFullYear()}년 {standardDate.getMonth() + 1}월
        </p>
        <button
          className={`
           flex items-center gap-1 text-xl transition
           ${
             addMonths(startOfMonth(standardDate), 1) <= endDate
               ? 'hover:text-primary cursor-pointer'
               : 'text-default-300 cursor-default'
           }
          `}
          onClick={() => {
            const newDate = addMonths(startOfMonth(standardDate), 1);
            if (
              newDate <= endDate &&
              newDate.toDateString() !== standardDate.toDateString()
            ) {
              setStandardDate(newDate);
            }
          }}
        >
          {addMonths(standardDate, 1).getMonth() + 1}월
          <AiOutlineArrowRight />
        </button>
      </div>
      <div className='grid grid-cols-7 gap-1'>
        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, idx) => (
          <div
            key={idx}
            className='flex h-10 items-center justify-center font-bold'
          >
            {day}
          </div>
        ))}
        {Array.from(
          Array(getDay(startOfMonth(startOfDay(standardDate)))).keys()
        ).map((day, idx) => (
          <div
            key={idx}
            className='flex h-10 items-center justify-center'
          ></div>
        ))}
        {monthView.map((day, idx) => (
          <div
            key={idx}
            className={`animate-appearance-in flex h-10 cursor-pointer items-center justify-center rounded-2xl transition ${getDayClass(
              day
            )}`}
            onMouseOver={() => setHoverDate(day)}
            onMouseOut={() => setHoverDate(undefined)}
            onClick={() => handleDateClick(day)}
          >
            {day.getDate()}일
          </div>
        ))}
      </div>
    </div>
  );
}
