'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BiCalendar, BiHome, BiPaint, BiSearch } from 'react-icons/bi';

export default function Bottombar() {
  const pathname = usePathname();
  return (
    <>
      <div className='fixed bottom-0 left-0 right-0 flex md:hidden justify-around items-center h-14 bg-white shadow-md dark:bg-gray-800'>
        <Link href='/'>
          <button className={`${pathname === '/' && 'text-blue-500'} p-3`}>
            <BiHome className='h-6 w-6' />
            <span className='sr-only'>Feed</span>
          </button>
        </Link>
        <Link href='/artworks'>
          <button
            className={`${
              pathname.startsWith('/artwork') && 'text-blue-500'
            } p-3`}>
            <BiPaint className='h-6 w-6' />
            <span className='sr-only'>Artworks</span>
          </button>
        </Link>
        <Link href='/events'>
          <button
            className={`${
              pathname.startsWith('/event') && 'text-blue-500'
            } p-3`}>
            <BiCalendar className='h-6 w-6' />
            <span className='sr-only'>Events</span>
          </button>
        </Link>
        <Link href='/search'>
          <button
            className={`${
              pathname.startsWith('/search') && 'text-blue-500'
            } p-3`}>
            <BiSearch className='h-6 w-6' />
            <span className='sr-only'>Search</span>
          </button>
        </Link>
      </div>
      <div className='h-14'></div>
    </>
  );
}
