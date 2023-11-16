import { EventType } from '@/types/event';

const EventTypeKO: {
  label: string;
  value: EventType;
}[] = [
  {
    label: '전시',
    value: 'EXHIBITION',
  },
  {
    label: '강의',
    value: 'LECTURE',
  },
  {
    label: '워크샵',
    value: 'WORKSHOP',
  },
  {
    label: '스페셜 이벤트',
    value: 'SPECIAL',
  },
  {
    label: '콘서트',
    value: 'CONCERT',
  },
  {
    label: '이벤트',
    value: 'STANDARD',
  },
];

const eventTypeToKO = (type: EventType) =>
  EventTypeKO.find((e) => e.value === type)?.label || '이벤트';

export default eventTypeToKO;
