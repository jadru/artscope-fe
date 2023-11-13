import Link from 'next/link';
import {
  BiSearch,
  BiSolidCalendar,
  BiSolidHome,
  BiSolidNetworkChart,
  BiSolidNews,
  BiSolidPlanet,
  BiSolidZap,
} from 'react-icons/bi';

const menuItems = [
  { href: '/', text: '홈', icon: <BiSolidHome size={23} />, active: true },
  {
    href: '/search',
    text: '검색',
    icon: <BiSearch size={23} />,
    active: true,
  },
  {
    href: '/artworks',
    text: '작품',
    icon: <BiSolidZap size={23} />,
    active: true,
  },
  {
    href: '/events',
    text: '이벤트',
    icon: <BiSolidCalendar size={23} />,
    active: true,
  },
  {
    href: '/agoras',
    text: '아고라',
    icon: <BiSolidNetworkChart size={23} />,
    active: true,
  },
  {
    href: '/',
    text: '네트워크',
    icon: <BiSolidPlanet size={23} />,
    active: false,
  },
  { href: '/', text: '매거진', icon: <BiSolidNews size={23} />, active: false },
];

export default function MainNavigation() {
  return (
    <>
      <div className='hidden h-max w-full flex-col space-y-2.5 px-3 md:block'>
        {menuItems.map((item) => (
          <Link
            key={item.text}
            href={item.href}
            className={`flex w-full rounded-3xl px-4 py-2.5 text-left ${
              item.active ? 'text-default-800' : 'text-default-400'
            } ${
              item.text === '홈' ? 'underline underline-offset-4' : ''
            } gap-2 font-bold decoration-2 transition hover:bg-default-100 hover:underline`}
          >
            {item.icon}
            <p className='text-lg'>{item.text}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
