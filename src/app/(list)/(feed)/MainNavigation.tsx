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

export default function MainNavigation() {
  return (
    <>
      <div className='hidden h-max w-full flex-col space-y-2.5 px-3 py-3 md:block'>
        <Link
          href='/'
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-black transition hover:bg-default-100'
        >
          <BiSolidHome size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>홈</p>
        </Link>
        <Link
          href='/search'
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-black transition hover:bg-default-100'
        >
          <BiSearch size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>검색</p>
        </Link>
        <Link
          href='/artworks'
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-black transition hover:bg-default-100'
        >
          <BiSolidZap size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>작품</p>
        </Link>
        <Link
          href='/events'
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-black transition hover:bg-default-100'
        >
          <BiSolidCalendar size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>이벤트</p>
        </Link>
        <Link
          href='/agora'
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-black transition hover:bg-default-100'
        >
          <BiSolidNetworkChart size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>아고라</p>
        </Link>
        <Link
          href='/'
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-default-500 transition'
        >
          <BiSolidPlanet size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>네트워크</p>
        </Link>
        <Link
          href='/'
          className='flex w-full rounded-3xl px-4 pb-1 pt-2 text-left text-default-500 transition'
        >
          <BiSolidNews size={23} className='my-0.5 mr-2' />
          <p className='my-1 text-lg'>매거진</p>
        </Link>
      </div>
    </>
  );
}
