import {
  BiSolidCalendar,
  BiSolidHome,
  BiSolidNetworkChart,
  BiSolidZap,
} from 'react-icons/bi';

export const menuItems = [
  // {
  //   name: '소개',
  //   slug: '/about',
  //   url: '/about',
  // },
  {
    name: '피드',
    slug: '/',
    url: '/',
    icon: BiSolidHome,
  },
  {
    name: '작품',
    slug: '/artwork',
    url: '/artworks',
    icon: BiSolidZap,
  },
  {
    name: '이벤트',
    slug: '/event',
    url: '/events',
    icon: BiSolidCalendar,
  },
  {
    name: '아고라',
    slug: '/agora',
    url: '/agoras',
    icon: BiSolidNetworkChart,
  },
  // {
  //   name: '네트워크',
  //   url: '/network',
  // },
  // {
  //   name: '매거진',
  //   url: '/magazine',
  // },

  // {
  //   name: '검색',
  //   slug: '/search',
  //   url: '/search',
  //   icon: BiSearch,
  // },
];
