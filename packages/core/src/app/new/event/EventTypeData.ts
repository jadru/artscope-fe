import { EventTypeLabel } from '@/types/event';

export const EventTypeData: EventTypeLabel = [
  {
    label: '기본',
    value: 'STANDARD',
    description: '다양한 활동에 적합한 표준 형식의 일반 이벤트입니다.',
  },
  {
    label: '전시',
    value: 'EXHIBITION',
    description:
      '그림부터 조각까지 다양한 예술 작품을 전시하는 아트 전시회입니다.',
  },
  {
    label: '강연',
    value: 'LECTURE',
    description:
      '전문가들이 특정 주제에 대해 발표하고 토론하는 강연 이벤트입니다.',
  },
  {
    label: '워크숍',
    value: 'WORKSHOP',
    description:
      '참가자들이 실습을 통해 특정 기술이나 지식을 배우는 워크숍 이벤트입니다.',
  },
  {
    label: '특별행사',
    value: 'SPECIAL',
    description: '기념일이나 특별한 사건을 축하하기 위한 특별 행사입니다.',
  },
  {
    label: '콘서트',
    value: 'CONCERT',
    description: '음악 공연이나 라이브 콘서트를 위한 이벤트입니다.',
  },
];
