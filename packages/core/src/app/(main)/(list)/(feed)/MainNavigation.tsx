'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BiBuilding,
  BiHome,
  BiSearch,
  BiSolidCalendar,
  BiSolidNetworkChart,
  BiSolidNews,
  BiSolidPlanet,
  BiSolidZap,
} from 'react-icons/bi';

const menuItems = [
  {
    href: '/',
    slug: '/',
    text: '피드',
    icon: <BiHome size={23} />,
    active: true,
  },
  {
    href: '/search',
    slug: '/search',
    text: '검색',
    icon: <BiSearch size={23} />,
    active: true,
  },
  {
    href: '/artworks',
    slug: '/artwork',
    text: '작품',
    icon: <BiSolidZap size={23} />,
    active: true,
  },
  {
    href: '/events',
    slug: '/event',
    text: '이벤트',
    icon: <BiSolidCalendar size={23} />,
    active: true,
  },
  {
    href: '/agoras',
    slug: '/agora',
    text: '아고라',
    icon: <BiSolidNetworkChart size={23} />,
    active: true,
  },
  {
    href: '/spaces',
    slug: '/space',
    text: '공간',
    icon: <BiBuilding size={23} />,
    active: true,
  },
  {
    href: '/',
    slug: '/network',
    text: '네트워크',
    icon: <BiSolidPlanet size={23} />,
    active: false,
  },
  {
    href: '/',
    slug: 'magazine',
    text: '매거진',
    icon: <BiSolidNews size={23} />,
    active: false,
  },
];

export default function MainNavigation() {
  const pathname = usePathname();
  return (
    <>
      <div className='hidden h-max w-full flex-col gap-1.5 px-2 py-2 md:block'>
        {menuItems.map((item, index) => (
          <Link
            key={item.text}
            href={item.href}
            className={`flex w-full rounded-3xl px-4 py-2.5 text-left ${
              item.active
                ? 'text-default-800 hover:bg-default-100 hover:underline'
                : 'text-default-400'
            } gap-1.5 font-bold decoration-2 underline-offset-4 transition ${
              index === 0
                ? pathname === '/'
                  ? 'underline'
                  : ''
                : pathname.startsWith(item.slug)
                ? 'underline'
                : ''
            }`}>
            {item.icon}
            <p className='text-lg'>{item.text}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
