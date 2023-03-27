import Link from 'next/link';
import React from 'react';
const TopMenu = () => (
  <div className='mb-4'>
    <Link href='/' className='btn-ghost btn text-5xl font-bold'>
      플레이리스트
    </Link>
    <Link href='/magazine' className='btn-ghost btn text-5xl font-light'>
      매거진
    </Link>
  </div>
);

export default TopMenu;
