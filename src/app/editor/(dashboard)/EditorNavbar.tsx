'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

import { Button } from '@/components/ui/button';

export default function EditorNavbar() {
  const pathname = usePathname();
  return (
    <nav className='flex-none gap-3 text-md font-medium flex flex-row items-center md:gap-5 md:text-sm lg:gap-6'>
      <Link href='/'>
        <span className='-tracking-[.05em] font-logo font-black text-2xl'>
          ARTSCOPE
        </span>
      </Link>
      <Link
        className={`${
          pathname !== '/editor' ? 'text-gray-500' : 'text-gray-900 font-bold'
        } hover:text-gray-900`}
        href='/editor'>
        아티클
      </Link>
      {/* <Link */}
      {/*   className={`${ */}
      {/*     pathname !== '/editor/statistics' */}
      {/*       ? 'text-gray-500' */}
      {/*       : 'text-gray-900 font-bold' */}
      {/*   } hover:text-gray-900`} */}
      {/*   href='#'> */}
      {/*   통계 */}
      {/* </Link> */}
      <Link
        className={`${
          pathname !== '/editor/settings'
            ? 'text-gray-500'
            : 'text-gray-900 font-bold'
        } hover:text-gray-900`}
        href='/editor/settings'>
        설정
      </Link>
      <Link href='/editor/new'>
        <Button variant='outline'>새 아티클</Button>
      </Link>
    </nav>
  );
}
