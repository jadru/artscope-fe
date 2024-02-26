'use client';

import Link from 'next/link';
import React from 'react';

import Logo from '@/assets/images/logo_long.svg';

export default function Navbar() {
  return (
    <Link
      href='/'
      className='text-medium group box-border h-10 basis-0 cursor-pointer flex-row items-center flex-nowrap  justify-start whitespace-nowrap bg-transparent no-underline flex fixed top-6'>
      <Logo className='group-hover:fill-primary w-52 overflow-hidden fill-black px-2 pb-1 pt-1 transition duration-100 ml-5' />
    </Link>
  );
}
