import Link from 'next/link';
import React from 'react';

export const TopMenu: React.FC = () => (
  <div className='mb-4'>
    <Link href='/' className='link mx-2 text-5xl font-bold'>
      홈
    </Link>
    <Link href='/' className='link mx-2 text-5xl font-light'>
      플레이리스트
    </Link>
    <Link href='/' className='link mx-2 text-5xl font-light'>
      매거진
    </Link>
  </div>
);
